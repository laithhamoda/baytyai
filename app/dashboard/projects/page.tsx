// Redirect to the dashboard home which already shows the projects table
import { redirect } from 'next/navigation';

export default function ProjectsPage() {
  redirect('/dashboard');
}
