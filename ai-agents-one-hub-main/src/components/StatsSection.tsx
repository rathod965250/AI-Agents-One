
import { Users, Star, Bot, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [{
  id: 1,
  title: "Total AI Agents",
  value: "1,247",
  description: "Curated and verified",
  icon: Bot,
  color: "text-blue-500",
  change: "+12%"
}, {
  id: 2,
  title: "User Reviews",
  value: "89,432",
  description: "Honest feedback",
  icon: Star,
  color: "text-yellow-500",
  change: "+18%"
}, {
  id: 3,
  title: "Active Users",
  value: "234,567",
  description: "Growing community",
  icon: Users,
  color: "text-green-500",
  change: "+24%"
}, {
  id: 4,
  title: "Success Rate",
  value: "94.2%",
  description: "User satisfaction",
  icon: TrendingUp,
  color: "text-purple-500",
  change: "+3%"
}];

const StatsSection = () => {
  return (
    <section className="py-20 px-2 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(stat => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.id} className="bg-card border-border text-center group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mb-2">{stat.description}</div>
                  <div className="text-sm font-medium text-green-600">{stat.change}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
