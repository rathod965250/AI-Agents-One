import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import AgentCardLine from './AgentCardLine';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';

const AGENTS_PER_PAGE = 20;

type Agent = Tables<'ai_agents'>;

interface FeaturedAgentsProps {
  searchResults?: Agent[];
  searchQuery?: string;
}

const FeaturedAgents = ({ searchResults, searchQuery }: FeaturedAgentsProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const { data: agentsData, isLoading, error } = useQuery({
    queryKey: ['approved-agents', currentPage],
    queryFn: async () => {
      const from = (currentPage - 1) * AGENTS_PER_PAGE;
      const to = from + AGENTS_PER_PAGE - 1;

      const { data: agents, error: agentsError, count } = await supabase
        .from('ai_agents')
        .select('*', { count: 'exact' })
        .in('status', ['approved', 'featured'])
        .range(from, to)
        .order('featured_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (agentsError) throw agentsError;

      return {
        agents: agents || [],
        totalCount: count || 0
      };
    },
    enabled: !searchQuery // Only fetch when not searching
  });

  // Use search results if available, otherwise use regular data
  const displayAgents = searchQuery && searchResults ? searchResults : agentsData?.agents || [];
  const totalCount = searchQuery && searchResults ? searchResults.length : (agentsData?.totalCount || 0);
  
  // For search results, implement client-side pagination
  const paginatedSearchResults = searchQuery && searchResults ? 
    searchResults.slice((currentPage - 1) * AGENTS_PER_PAGE, currentPage * AGENTS_PER_PAGE) : 
    displayAgents;

  const totalPages = Math.ceil(totalCount / AGENTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of agents section
    const agentsSection = document.querySelector('#agents-section');
    agentsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (error) {
    return (
      <section id="agents-section" className="bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">Error loading agents. Please try again.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agents-section" className="bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Agents'}
          </h2>
          <p className="text-gray-600">
            {searchQuery ? 
              `Found ${totalCount} agent${totalCount !== 1 ? 's' : ''} matching your search` :
              'Discover the most popular and recently added AI agents'
            }
          </p>
        </div>

        {isLoading && !searchQuery ? (
          // Loading skeleton with updated colors
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="space-y-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
                <Skeleton className="h-32 w-full rounded-lg bg-blue-100" />
                <Skeleton className="h-4 w-3/4 bg-blue-100" />
                <Skeleton className="h-4 w-1/2 bg-blue-100" />
              </div>
            ))}
          </div>
        ) : paginatedSearchResults.length === 0 ? (
          <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-2xl border border-blue-100">
            <p className="text-gray-500">
              {searchQuery ? 'No agents found matching your search criteria.' : 'No approved agents found.'}
            </p>
            {searchQuery && (
              <p className="text-gray-400 mt-2">
                Try different keywords or check for spelling mistakes.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Agents Grid - 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedSearchResults.map(agent => (
                <AgentCardLine key={agent.id} agent={agent} />
              ))}
            </div>

            {/* Pagination with updated colors */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent className="bg-white/50 backdrop-blur-sm rounded-lg border border-blue-100 p-2">
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === pageNumber}
                            className={currentPage === pageNumber ? 
                              'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 
                              'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          href="#"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedAgents;
