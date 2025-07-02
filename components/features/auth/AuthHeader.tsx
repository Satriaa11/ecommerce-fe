import Link from "next/link";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
}

export const AuthHeader = ({
  title,
  subtitle,
  linkText,
  linkHref,
}: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-base-content">{title}</h2>
      <p className="mt-2 text-sm text-base-content/70">
        {subtitle}{" "}
        <Link href={linkHref} className="link link-primary">
          {linkText}
        </Link>
      </p>
    </div>
  );
};
