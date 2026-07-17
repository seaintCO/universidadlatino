import type { Course } from "@/types/course";

export const tradingDesdeCero: Course = {
  id: "course-trading-001",
  slug: "trading-desde-cero",
  title: "Trading desde Cero",
  category: "Trading",
  description:
    "Aprende la estructura de los mercados, gestión de riesgo y ejecución disciplinada.",
  longDescription:
    "Una ruta práctica para entender cómo funcionan los mercados, leer gráficas, administrar el riesgo y desarrollar un proceso de trading estructurado.",
  level: "Principiante",
  estimatedHours: 32,
  thumbnail: "/images/courses/trading-desde-cero.jpg",
  accent: "#2f6650",
  isPublished: true,
  modules: [
    {
      id: "trading-module-01",
      slug: "fundamentos-del-mercado",
      title: "Fundamentos del mercado",
      description:
        "Comprende qué es el mercado y cómo participan compradores y vendedores.",
      order: 1,
      lessons: [
        {
          id: "trading-lesson-01",
          slug: "como-funcionan-los-mercados",
          title: "Cómo funcionan los mercados",
          description:
            "Una introducción clara a los mercados financieros y sus participantes.",
          durationMinutes: 12,
          summary: [
            "Los mercados conectan compradores y vendedores.",
            "El precio cambia según la oferta, la demanda y las expectativas.",
            "Cada operación debe tener un objetivo y un riesgo definido.",
          ],
          actionSteps: [
            "Escribe tu razón principal para aprender trading.",
            "Define cuánto tiempo puedes estudiar cada semana.",
            "Crea una lista de los mercados que quieres entender.",
          ],
          resources: [],
          isPreview: true,
          isPublished: true,
        },
        {
          id: "trading-lesson-02",
          slug: "acciones-etfs-indices-y-futuros",
          title: "Acciones, ETFs, índices y futuros",
          description:
            "Conoce las diferencias entre los instrumentos más utilizados.",
          durationMinutes: 15,
          summary: [
            "Una acción representa participación en una empresa.",
            "Un ETF agrupa diferentes activos.",
            "Los índices miden grupos de empresas.",
            "Los futuros son contratos derivados.",
          ],
          actionSteps: [
            "Compara SPY, QQQ y SPX.",
            "Anota las diferencias entre acciones y futuros.",
          ],
          resources: [],
          isPublished: true,
        },
      ],
    },
    {
      id: "trading-module-02",
      slug: "lectura-de-graficas",
      title: "Lectura de gráficas",
      description:
        "Aprende velas, tendencias, soporte, resistencia y estructura.",
      order: 2,
      lessons: [],
    },
    {
      id: "trading-module-03",
      slug: "indicadores",
      title: "Indicadores técnicos",
      description: "Utiliza VWAP, EMA, RSI y MACD con propósito.",
      order: 3,
      lessons: [],
    },
    {
      id: "trading-module-04",
      slug: "gestion-de-riesgo",
      title: "Gestión de riesgo",
      description: "Protege tu capital y aprende a medir cada operación.",
      order: 4,
      lessons: [],
    },
    {
      id: "trading-module-05",
      slug: "estrategia-y-ejecucion",
      title: "Estrategia y ejecución",
      description: "Convierte el análisis en un proceso repetible.",
      order: 5,
      lessons: [],
    },
    {
      id: "trading-module-06",
      slug: "psicologia-y-plan",
      title: "Psicología y plan de trading",
      description: "Desarrolla disciplina, revisión y consistencia.",
      order: 6,
      lessons: [],
    },
  ],
};
