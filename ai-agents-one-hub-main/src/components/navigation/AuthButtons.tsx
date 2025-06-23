
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AuthButtons = () => {
  const { user, signOut } = useAuth();
  const { setRedirectUrl, currentPath } = useAuthRedirect();
  const navigate = useNavigate();

  const handleSignInClick = () => {
    // Store current page before redirecting to auth
    if (currentPath !== '/auth') {
      setRedirectUrl(currentPath);
    }
    navigate('/auth');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline-block">
              {user.user_metadata?.full_name || user.email}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignInClick}
      >
        Sign In
      </Button>
      <Button
        size="sm"
        onClick={handleSignInClick}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;
