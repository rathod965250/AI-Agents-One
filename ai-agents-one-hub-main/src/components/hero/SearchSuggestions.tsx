
interface SearchSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const SearchSuggestions = ({ onSuggestionClick }: SearchSuggestionsProps) => {
  const suggestions = ['Chatbot', 'Image Generator', 'Writing Assistant', 'Code Helper', 'Data Analysis'];

  return (
    <div className="mt-3 flex flex-wrap justify-center gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          className="px-3 py-1 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors border border-blue-200"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SearchSuggestions;
