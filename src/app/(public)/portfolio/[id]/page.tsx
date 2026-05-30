export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-24">
      <h1 className="text-3xl font-light tracking-wider text-neutral-800 mb-4">Projet : {params.id}</h1>
      <p className="text-neutral-600">Galerie photo et description de ce projet spécifique.</p>
    </div>
  );
}