import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react'
import { useUserService } from '../hooks/use-user-service'
import type { UserResponseDto } from '../../application/dtos/user.dto'
import { QUERY_KEYS, PAGINATION } from '../../shared/constants/app.constants'

export function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState<number>(PAGINATION.DEFAULT_PAGE)
  const userService = useUserService()

  // Utilisation de React Query avec Clean Architecture
  const { data: usersResponse, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.USERS, currentPage, searchTerm],
    queryFn: () => userService.getUsers(
      { page: currentPage, limit: PAGINATION.DEFAULT_LIMIT },
      searchTerm ? { search: searchTerm } : undefined
    ),
  })

  const users = usersResponse?.data || []
  const meta = usersResponse?.meta

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des utilisateurs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Erreur lors du chargement des utilisateurs</div>
      </div>
    )
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'moderator': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs de votre application.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher des utilisateurs</CardTitle>
          <CardDescription>
            Trouvez rapidement un utilisateur par nom ou email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des utilisateurs ({meta?.totalItems || 0})
          </CardTitle>
          {meta && (
            <CardDescription>
              Page {meta.currentPage} sur {meta.totalPages}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Nom</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Rôle</th>
                  <th className="text-left py-3 px-4 font-medium">Statut</th>
                  <th className="text-left py-3 px-4 font-medium">Dernière connexion</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: UserResponseDto) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Actif' : user.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Jamais'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                disabled={!meta.hasPreviousPage}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Précédent
              </Button>
              <span className="text-sm text-gray-600">
                Page {meta.currentPage} sur {meta.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={!meta.hasNextPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Suivant
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
