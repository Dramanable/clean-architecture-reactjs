import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, MoreHorizontal, Edit, Trash2, UserCheck, UserX } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'

import { useUserService } from '@/presentation/hooks/use-user-service.hook'
import type { UserResponseDto, PaginationDto, UserFiltersDto } from '@/application/dtos/user.dto'
import { UserRole, UserStatus } from '@/domain/entities/user.entity'

export default function UsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const userService = useUserService()

  // Fetch users with pagination and search
  const {
    data: usersData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => {
      const pagination: PaginationDto = { page, limit: 10 }
      const filters: UserFiltersDto | undefined = search ? { search } : undefined
      return userService.getUsers(pagination, filters)
    }
  })

  // Delete user mutation (TODO: Ajouter dans le service)
  const deleteUserMutation = useMutation({
    mutationFn: async (_userId: string) => {
      // TODO: Implémenter deleteUser dans le service
      throw new Error('Delete user not implemented yet')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Utilisateur supprimé',
        description: 'L\'utilisateur a été supprimé avec succès.',
      })
      setDeleteUserId(null)
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer l\'utilisateur.',
        variant: 'destructive',
      })
    }
  })

  // Toggle user status mutation (TODO: Ajouter dans le service)
  const toggleUserStatusMutation = useMutation({
    mutationFn: async (_params: { userId: string; currentStatus: UserStatus }) => {
      // TODO: Implémenter updateUser dans le service
      throw new Error('Update user not implemented yet')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast({
        title: 'Statut mis à jour',
        description: 'Le statut de l\'utilisateur a été mis à jour.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de mettre à jour le statut.',
        variant: 'destructive',
      })
    }
  })

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page on search
  }

  const handleDeleteUser = (userId: string) => {
    deleteUserMutation.mutate(userId)
  }

  const handleToggleStatus = (user: UserResponseDto) => {
    toggleUserStatusMutation.mutate({
      userId: user.id,
      currentStatus: user.status
    })
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'destructive'
      case UserRole.MODERATOR:
        return 'secondary'
      case UserRole.USER:
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return 'default'
      case UserStatus.INACTIVE:
        return 'secondary'
      case UserStatus.SUSPENDED:
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>
              Impossible de charger les utilisateurs: {(error as Error).message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()}>Réessayer</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs de votre application
          </p>
        </div>
        <Link to="/dashboard/users/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            {usersData?.meta.totalItems || 0} utilisateur(s) au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                          <div className="space-y-1">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
                      <TableCell><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : usersData?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {search ? 'Aucun utilisateur trouvé pour cette recherche.' : 'Aucun utilisateur trouvé.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  usersData?.data.map((user: UserResponseDto) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/dashboard/users/${user.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Modifier
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(user)}
                              disabled={toggleUserStatusMutation.isPending}
                            >
                              {user.status === UserStatus.ACTIVE ? (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteUserId(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {usersData && usersData.meta.totalItems > usersData.meta.itemsPerPage && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Affichage de {((page - 1) * usersData.meta.itemsPerPage) + 1} à {Math.min(page * usersData.meta.itemsPerPage, usersData.meta.totalItems)} sur {usersData.meta.totalItems} utilisateurs
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Précédent
                </Button>
                <div className="text-sm">
                  Page {page} sur {usersData.meta.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= usersData.meta.totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? 'Suppression...' : 'Supprimer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
