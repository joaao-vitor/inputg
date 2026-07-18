"use cache";

export const Footer = async () => {
  return (
    <footer className="p-6 w-full min-h-20 bg-accent mt-6">
      <div className="container mx-auto flex flex-col px-6">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} InputG. All rights reserved.
        </p>
        <p className="text-muted-foreground text-sm">
          Game data powered by{" "}
          <a
            href="igdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline opacity-70 hover:text-blue-500"
          >
            IGDB
          </a>
        </p>
      </div>
    </footer>
  );
};
