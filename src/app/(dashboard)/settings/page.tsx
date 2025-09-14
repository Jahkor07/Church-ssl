'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Calendar, 
  Info,
  RefreshCw,
  Check
} from 'lucide-react'

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('English')
  const [year, setYear] = useState('2024')
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true'
    const savedLanguage = localStorage.getItem('preferred-language') || 'English'
    const savedYear = localStorage.getItem('preferred-year') || '2024'
    
    setDarkMode(savedDarkMode)
    setLanguage(savedLanguage)
    setYear(savedYear)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('dark-mode', newDarkMode.toString())
    document.documentElement.classList.toggle('dark')
  }

  const updateLanguage = (newLanguage: string) => {
    setLanguage(newLanguage)
    localStorage.setItem('preferred-language', newLanguage)
  }

  const updateYear = (newYear: string) => {
    setYear(newYear)
    localStorage.setItem('preferred-year', newYear)
  }

  const resetSettings = () => {
    localStorage.removeItem('dark-mode')
    localStorage.removeItem('preferred-language')
    localStorage.removeItem('preferred-year')
    localStorage.removeItem('user-notes')
    
    setDarkMode(false)
    setLanguage('English')
    setYear('2024')
    document.documentElement.classList.remove('dark')
    setShowResetConfirm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Customize your Church SSL experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <SettingsIcon className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Switch between light and dark themes
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={toggleDarkMode}
                  className="flex items-center space-x-2"
                >
                  {darkMode ? (
                    <>
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Language
                </label>
                <select
                  value={language}
                  onChange={(e) => updateLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>Portuguese</option>
                  <option>German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Year
                </label>
                <select
                  value={year}
                  onChange={(e) => updateYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <RefreshCw className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Data Management</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Reset Settings</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  This will reset all your preferences and clear your notes. This action cannot be undone.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(true)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Reset All Settings
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Info className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Church SSL</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Study, Share, and Grow in Faith
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Version</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">1.0.0</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white text-sm">Features</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Interactive lessons</li>
                  <li>• Personal notes</li>
                  <li>• Multi-language support</li>
                  <li>• Dark mode</li>
                  <li>• Responsive design</li>
                </ul>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Built with Next.js, Tailwind CSS, and Shadcn/UI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Reset Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to reset all settings? This will clear your notes and preferences. This action cannot be undone.
              </p>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={resetSettings}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Yes, Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

