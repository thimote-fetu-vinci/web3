import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  return (
    <div className="text-center">
      <h1 className="text-5xl">Welcome to the Expense Tracker</h1>
      <div className="text-center py-12">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
      </div>
      <div className="flex flex-row gap-4 justify-center">
        <Button asChild className="bg-green-800 text-white hover:bg-green-700 rounded-full px-6">
          <NavLink to="/list">View Expenses</NavLink>
        </Button>
        <Button asChild className="bg-green-800 text-white hover:bg-green-700 rounded-full px-6">
          <NavLink to="/add">Add Expense</NavLink>
        </Button>
      </div>
    </div>
  );
}
