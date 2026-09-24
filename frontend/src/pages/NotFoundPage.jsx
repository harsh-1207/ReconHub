import { Link } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you requested does not exist."
      action={
        <Link className="button button-primary" to="/">
          Back to dashboard
        </Link>
      }
    />
  );
}
