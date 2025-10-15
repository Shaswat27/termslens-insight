import logo from "@/assets/termslens-logo.png";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <img 
          src={logo} 
          alt="TermsLens" 
          className="h-8 md:h-10"
        />
      </div>
    </header>
  );
};
