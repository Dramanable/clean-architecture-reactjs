import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Users, Activity, CreditCard, DollarSign } from 'lucide-react'

const stats = [
  {
    title: "Total des utilisateurs",
    value: "2,350",
    description: "+180 ce mois",
    icon: Users,
    trend: "+20.1%"
  },
  {
    title: "Sessions actives",
    value: "1,234",
    description: "Actuellement en ligne",
    icon: Activity,
    trend: "+12%"
  },
  {
    title: "Revenus",
    value: "45,231€",
    description: "+19% vs mois dernier",
    icon: DollarSign,
    trend: "+19%"
  },
  {
    title: "Conversions",
    value: "573",
    description: "+201 depuis hier",
    icon: CreditCard,
    trend: "+8.2%"
  }
]

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Voici un aperçu de vos métriques importantes.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.trend}</span> {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aperçu</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Graphique à venir...
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Vous avez fait 265 ventes ce mois.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Liste d'activités à venir...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
