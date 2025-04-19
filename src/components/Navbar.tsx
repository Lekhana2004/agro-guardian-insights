
import React, { useState } from "react";
import { Search, Menu, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavbarProps {
  location: string;
  setLocation: (location: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ location, setLocation }) => {
  const [searchValue, setSearchValue] = useState(location);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(searchValue);
    setIsSearchOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-agro-green-dark">
                AgroGuard
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <form onSubmit={handleSearch} className="relative w-64">
              <Input
                type="text"
                placeholder="Search location..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Search Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <h2 className="text-xl font-bold text-agro-green-dark mb-4">
                    AgroGuard
                  </h2>
                  <div className="space-y-3">
                    <button className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100">
                      Dashboard
                    </button>
                    <button className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100">
                      Disease Detection
                    </button>
                    <button className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100">
                      Fertilizer Advisor
                    </button>
                    <button className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100">
                      Local Advisory
                    </button>
                    <button className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100">
                      Settings
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={cn(
            "pb-3 md:hidden",
            isSearchOpen ? "block" : "hidden"
          )}
        >
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Search location..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pr-10"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
