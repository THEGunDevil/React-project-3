import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
export default function Footer() {
  return (
    <footer className="p-6 md:mt-10">
      <Card className="mx-auto shadow-none rounded-none border-0 border-t-1 flex flex-col md:flex-row justify-between gap-0 items-center px-4 w-full">
        <p className="text-center text-nowrap md:text-left text-sm text-primary">
          &copy; {new Date().getFullYear()} Himel. All rights reserved.
        </p>
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:gap-4 gap-2 items-end justify-end w-full">
          <Button variant="ghost" className="text-black hover:bg-green-400">
            Privacy Policy
          </Button>
          <Button variant="ghost" className="text-black hover:bg-green-400">
            Terms of Service
          </Button>
          <Button variant="ghost" className="text-black hover:bg-green-400">
            Contact
          </Button>
        </div>
      </Card>
    </footer>
  );
}
