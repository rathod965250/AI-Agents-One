
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  onToggle: () => void;
}

const MobileMenuButton = ({ isMenuOpen, onToggle }: MobileMenuButtonProps) => {
  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default MobileMenuButton;
