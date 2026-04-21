import { useState, useEffect, useRef } from "react"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Жилой дом Уссурийск",
    category: "Жилой дом",
    location: "Уссурийск, Россия",
    year: "2024",
    images: [
      "https://cdn.poehali.dev/projects/48cabe3b-8dcc-4763-b1e8-63788c6243a7/bucket/3ae498b9-5d09-4f1a-884a-817c20a7e44a.jpg",
      "https://cdn.poehali.dev/projects/48cabe3b-8dcc-4763-b1e8-63788c6243a7/bucket/2ece7531-c138-45af-9b11-53046ee9a172.jpg",
      "https://cdn.poehali.dev/projects/48cabe3b-8dcc-4763-b1e8-63788c6243a7/bucket/46339090-f1f3-4699-a59e-c70bd9370fab.jpg",
      "https://cdn.poehali.dev/projects/48cabe3b-8dcc-4763-b1e8-63788c6243a7/bucket/a3320ab5-73ca-4b4a-a23e-b495f8b47b63.jpg",
    ],
  },
  {
    id: 2,
    title: "Брутальный интерьер",
    category: "Жилой дом",
    location: "Новоникольск, Россия",
    year: "2023",
    images: [
      "https://cdn.poehali.dev/projects/48cabe3b-8dcc-4763-b1e8-63788c6243a7/bucket/da6775f8-e984-41bb-9046-942220520e2b.jpg",
      "https://cdn.poehali.dev/projects/48cabe3b-8dcc-4763-b1e8-63788c6243a7/bucket/cd02adb3-9dbc-44f5-a094-bb64e3fb716f.jpg",
      "https://cdn.poehali.dev/projects/48cabe3b-8dcc-4763-b1e8-63788c6243a7/bucket/8178f5cb-387f-4584-849c-e5a7f254363b.jpg",
      "https://cdn.poehali.dev/projects/48cabe3b-8dcc-4763-b1e8-63788c6243a7/bucket/5fa8e3b0-8388-4e89-b1cd-eb6e1a19fb83.jpg",
      "https://cdn.poehali.dev/projects/48cabe3b-8dcc-4763-b1e8-63788c6243a7/bucket/811eac14-0531-403c-bea8-afd4bde2bc0d.jpg",
    ],
  },

]

export function Projects() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({})
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const intervalRef = useRef<Record<number, ReturnType<typeof setInterval>>>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(projects[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const handleMouseEnter = (project: typeof projects[0]) => {
    setHoveredId(project.id)
    if (project.images.length > 1) {
      intervalRef.current[project.id] = setInterval(() => {
        setActiveImageIndex((prev) => ({
          ...prev,
          [project.id]: ((prev[project.id] ?? 0) + 1) % project.images.length,
        }))
      }, 900)
    }
  }

  const handleMouseLeave = (project: typeof projects[0]) => {
    setHoveredId(null)
    clearInterval(intervalRef.current[project.id])
    setActiveImageIndex((prev) => ({ ...prev, [project.id]: 0 }))
  }

  return (
    <section id="projects" className="py-32 md:py-29 bg-secondary/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Избранные работы</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">Наши проекты</h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Смотреть все проекты
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => {
            const currentImageIdx = activeImageIndex[project.id] ?? 0
            return (
              <article
                key={project.id}
                className="group cursor-pointer"
                onMouseEnter={() => handleMouseEnter(project)}
                onMouseLeave={() => handleMouseLeave(project)}
              >
                <div ref={(el) => (imageRefs.current[index] = el)} className="relative overflow-hidden aspect-[4/3] mb-6">
                  <img
                    src={project.images[currentImageIdx]}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredId === project.id ? "scale-105" : "scale-100"
                    }`}
                  />
                  {project.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {project.images.map((_, i) => (
                        <span
                          key={i}
                          className={`block h-1 rounded-full transition-all duration-300 ${
                            i === currentImageIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  <div
                    className="absolute inset-0 bg-primary origin-top"
                    style={{
                      transform: revealedImages.has(project.id) ? "scaleY(0)" : "scaleY(1)",
                      transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                    }}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2 group-hover:underline underline-offset-4">{project.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {project.category} · {project.location}
                    </p>
                  </div>
                  <span className="text-muted-foreground/60 text-sm">{project.year}</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}