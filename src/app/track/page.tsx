import { goToTracking } from "../actions";

export const metadata = { title: "Track a request" };

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold">Track your request</h1>
      <form action={goToTracking} className="card mt-6 space-y-3">
        <label htmlFor="ref" className="label">Reference number</label>
        <input id="ref" name="ref" required placeholder="BRGY-2026-XXXXXX" className="input uppercase" />
        <button className="btn w-full">Track</button>
      </form>
