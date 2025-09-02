import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Settings as SettingsIcon, Save, Bell, Shield, Palette } from 'lucide-react'

export function Settings() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez votre application et vos préférences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="w-5 h-5 mr-2" />
              Paramètres généraux
            </CardTitle>
            <CardDescription>
              Configuration de base de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de l'application</label>
                <Input placeholder="Mon Admin Panel" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL de base</label>
                <Input placeholder="https://mon-app.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input placeholder="Description de votre application..." />
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications par email</div>
                <div className="text-sm text-muted-foreground">
                  Recevoir des notifications importantes par email
                </div>
              </div>
              <Button variant="outline" size="sm">
                Activé
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Notifications push</div>
                <div className="text-sm text-muted-foreground">
                  Recevoir des notifications dans le navigateur
                </div>
              </div>
              <Button variant="outline" size="sm">
                Désactivé
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Rapport hebdomadaire</div>
                <div className="text-sm text-muted-foreground">
                  Recevoir un résumé des activités chaque semaine
                </div>
              </div>
              <Button variant="outline" size="sm">
                Activé
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et d'authentification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Changer le mot de passe</label>
              <div className="grid grid-cols-2 gap-4">
                <Input type="password" placeholder="Nouveau mot de passe" />
                <Input type="password" placeholder="Confirmer le mot de passe" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Authentification à deux facteurs</div>
                <div className="text-sm text-muted-foreground">
                  Ajouter une couche de sécurité supplémentaire
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configurer
              </Button>
            </div>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Mettre à jour la sécurité
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de votre tableau de bord.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Thème</label>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded mb-2"></div>
                  Clair
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 bg-gray-800 rounded mb-2"></div>
                  Sombre
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded mb-2"></div>
                  Auto
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Couleur d'accent</label>
              <div className="flex space-x-2">
                {['blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full bg-${color}-500 border-2 border-transparent hover:border-gray-300`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
