import Link from "next/link";
import { ArrowIcon } from "./components/SiteShell";

export default function NotFound() {
  return (
    <section className="not-found shell">
      <p className="eyebrow">Error / 404</p>
      <h1 className="page-display">This route escaped the system.</h1>
      <p>The useful paths are still exactly where you left them.</p>
      <Link className="button button--primary" href="/">Return home <ArrowIcon /></Link>
    </section>
  );
}
