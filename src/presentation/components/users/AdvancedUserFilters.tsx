import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { Filter, X } from 'lucide-react'
import type { UserFilters } from '../../../domain/repositories/user.repository'

interface AdvancedFiltersProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
  onReset: () => void
}

export function AdvancedUserFilters({ filters, onFiltersChange, onReset }: AdvancedFiltersProps) {
  const { t } = useTranslation()
  const [showFilters, setShowFilters] = useState(false)

  const handleRoleChange = (roles: string[]) => {
    onFiltersChange({
      ...filters,
      roles
    })
  }

  const handleStatusChange = (isActive: boolean | undefined) => {
    onFiltersChange({
      ...filters,
      isActive
    })
  }

  const handleDateChange = (field: 'createdAfter' | 'createdBefore', value: string) => {
    const date = value ? new Date(value) : undefined
    onFiltersChange({
      ...filters,
      [field]: date
    })
  }

  const hasActiveFilters = Boolean(
    filters.roles?.length || 
    filters.isActive !== undefined || 
    filters.createdAfter || 
    filters.createdBefore
  )

  const handleResetFilters = () => {
    onReset()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          {t('users.filters.advanced')}
          {hasActiveFilters && (
            <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {t('users.filters.active')}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters}>
            <X className="h-4 w-4 mr-1" />
            {t('users.filters.reset')}
          </Button>
        )}
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('users.filters.title')}</CardTitle>
            <CardDescription>{t('users.filters.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Filtre par rôle */}
              <div className="space-y-2">
                <Label>{t('users.filters.roles')}</Label>
                <div className="space-y-2">
                  {['USER', 'MANAGER', 'SUPER_ADMIN'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={filters.roles?.includes(role) || false}
                        onCheckedChange={(checked: boolean) => {
                          const currentRoles = filters.roles || []
                          if (checked) {
                            handleRoleChange([...currentRoles, role])
                          } else {
                            handleRoleChange(currentRoles.filter((r: string) => r !== role))
                          }
                        }}
                      />
                      <Label htmlFor={`role-${role}`} className="text-sm font-normal">
                        {t(`roles.${role.toLowerCase().replace('_', '')}`)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtre par statut */}
              <div className="space-y-2">
                <Label>{t('users.filters.status')}</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-all"
                      checked={filters.isActive === undefined}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) handleStatusChange(undefined)
                      }}
                    />
                    <Label htmlFor="status-all" className="text-sm font-normal">
                      {t('users.filters.allStatuses')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-active"
                      checked={filters.isActive === true}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) handleStatusChange(true)
                      }}
                    />
                    <Label htmlFor="status-active" className="text-sm font-normal">
                      {t('users.active')}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status-inactive"
                      checked={filters.isActive === false}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) handleStatusChange(false)
                      }}
                    />
                    <Label htmlFor="status-inactive" className="text-sm font-normal">
                      {t('users.inactive')}
                    </Label>
                  </div>
                </div>
              </div>

              {/* Date de création - Après */}
              <div className="space-y-2">
                <Label htmlFor="created-after">{t('users.filters.createdAfter')}</Label>
                <Input
                  id="created-after"
                  type="date"
                  value={filters.createdAfter ? filters.createdAfter.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange('createdAfter', e.target.value)}
                />
              </div>

              {/* Date de création - Avant */}
              <div className="space-y-2">
                <Label htmlFor="created-before">{t('users.filters.createdBefore')}</Label>
                <Input
                  id="created-before"
                  type="date"
                  value={filters.createdBefore ? filters.createdBefore.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleDateChange('createdBefore', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
