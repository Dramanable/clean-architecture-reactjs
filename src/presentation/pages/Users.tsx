import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Alert, AlertDescription } from '@/presentation/components/ui/alert'
import { Plus, Search, Edit, Trash2, AlertCircle, Loader2 } from 'lucide-react'
import { useUserManagement } from '../hooks/use-user-management'
import { useUserRoleTranslation, useFormatters } from '../../i18n/hooks'
import { AdvancedUserFilters } from '../components/users/AdvancedUserFilters'
import type { UserFilters } from '../../domain/repositories/user.repository'

export function Users() {
  const { t } = useTranslation()
  const { translateRole, translateStatus } = useUserRoleTranslation()
  const { formatDate } = useFormatters()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<UserFilters>({})
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize] = useState<number>(10)

  const {
    users,
    totalCount,
    isLoading,
    error,
    loadUsers,
    clearError
  } = useUserManagement()

  // Mémoriser les filtres pour éviter les re-renders inutiles
  const serializedFilters = useMemo(() => JSON.stringify(filters), [filters])

  // Charger les utilisateurs au montage et quand les paramètres changent
  useEffect(() => {
    const pagination = { page: currentPage, limit: pageSize }
    const allFilters = {
      ...filters,
      ...(searchTerm && { searchTerm })
    }
    const finalFilters = Object.keys(allFilters).length > 0 ? allFilters : undefined
    loadUsers(pagination, finalFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, pageSize, serializedFilters])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset à la première page lors d'une recherche
  }

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset à la première page lors d'un changement de filtre
  }

  const handleFiltersReset = () => {
    setFilters({})
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleCreateUser = () => {
    // TODO: Ouvrir le modal de création
    console.log('Create user')
  }

  const handleEditUser = (userId: string) => {
    // TODO: Ouvrir le modal d'édition
    console.log('Edit user:', userId)
  }

  

  const handleDeleteUser = (userId: string) => {
    // TODO: Ouvrir le modal de confirmation
    console.log('Delete user:', userId)
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('users.title')}</h1>
          <p className="text-muted-foreground">{t('users.description')}</p>
        </div>
        <Button onClick={handleCreateUser}>
          <Plus className="mr-2 h-4 w-4" />
          {t('users.create')}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" onClick={clearError} className="ml-2">
              {t('common.dismiss')}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('users.list')}</CardTitle>
          <CardDescription>{t('users.listDescription', { count: totalCount })}</CardDescription>
          
          {/* Barre de recherche */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('users.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Filtres avancés */}
          <AdvancedUserFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleFiltersReset}
          />
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>{t('common.loading')}</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? t('users.noResultsFound') : t('users.noUsersFound')}
              </p>
            </div>
          ) : (
            <>
              {/* Tableau des utilisateurs */}
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium">{t('users.name')}</th>
                      <th className="text-left p-4 font-medium">{t('users.email')}</th>
                      <th className="text-left p-4 font-medium">{t('users.role')}</th>
                      <th className="text-left p-4 font-medium">{t('users.status')}</th>
                      <th className="text-left p-4 font-medium">{t('users.createdAt')}</th>
                      <th className="text-right p-4 font-medium">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{user.email}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700">
                            {translateRole(user.role)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {translateStatus(user.status)}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between py-4">
                  <p className="text-sm text-muted-foreground">
                    {t('users.pagination.showing', {
                      start: (currentPage - 1) * pageSize + 1,
                      end: Math.min(currentPage * pageSize, totalCount),
                      total: totalCount
                    })}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      {t('users.pagination.previous')}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {t('users.pagination.page', { current: currentPage, total: totalPages })}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      {t('users.pagination.next')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
