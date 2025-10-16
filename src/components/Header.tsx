// Remove this import statement
// import logo from "@/public/termslens-logo.png";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <img
          // Use an absolute path to the image in the public folder
          src="/termslens-logo.png"
          alt="TermsLens"
          className="h-8 md:h-10"
        />
      </div>
    </header>
  );
};