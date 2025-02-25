// import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          Welcome to the WeConnect Code Challenge!
        </h1>

        <div className="space-y-6 text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <h2 className="text-xl font-semibold">What to expect:</h2>

          <ol className="list-inside list-decimal space-y-3">
            <li>
              Fork the repository and create a pull request with your solution
            </li>
            <li>Submit your pull request for review</li>

            <li>Containerize your project using Docker (extra-credit)</li>
          </ol>

          <p className="text-xs leading-relaxed text-gray-400 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
            Please note that the use of AI tools to complete this challenge is
            not allowed.
            <br /> We want to assess your skills and understanding of the
            technologies involved.
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-8 sm:px-10 font-semibold"
            href="/start"
          >
            Start Challenge →
          </Link>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm text-gray-600 dark:text-gray-400">
        <p>WeConnect LLC</p>
      </footer>
    </div>
  );
}
