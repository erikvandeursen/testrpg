import { ApiEndpoints } from "@/components/api-explainer";

export default function ApiPage() {
  return (
    <div className="space-y-4">
      <section data-testid="hero" className="text-center space-y-2">
        <h1 className="max-w-3xl text-5xl font-extrabold md:text-6xl lg:text-7xl tracking-tight leading-none bg-gradient-to-tr from-blue-400 to-blue-800 bg-clip-text text-transparent">
          TestRPG <span className="text-2xl">API endpoints</span>
        </h1>
        <h2 className="max-w-prose sm:text-lg text-slate-700 dark:text-slate-200">
          Some test endpoints for you to use
        </h2>
      </section>
      <ApiEndpoints />
    </div>
  );
}
