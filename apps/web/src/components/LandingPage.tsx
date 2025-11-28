import React, { useState } from 'react'
import { useRouter } from 'next/router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from 'apps/web/src/components/ui/card'
import { Button } from 'apps/web/src/components/ui/button'
import { HelpCircle, HandHeart, User, Users } from 'lucide-react'

type ViewMode = 'initial' | 'need-help' | 'can-help'

export default function LandingPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<ViewMode>('initial')

  const handleNeedHelp = () => {
    setViewMode('need-help')
  }

  const handleCanHelp = () => {
    router.push('/help')
  }

  const handleIndividual = () => {
    router.push('/need-help')
  }

  const handleGroup = () => {
    router.push('/camp')
  }

  const handleBack = () => {
    setViewMode('initial')
  }

  // Initial view - Choose between "I Need Help" or "I Can Help"
  if (viewMode === 'initial') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sri Lanka Crisis Help
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Connect those in need with those who can help
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* I Need Help Card */}
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">I Need Help</CardTitle>
                <CardDescription className="text-base mt-2">
                  Request assistance for food, medical, rescue, or shelter
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={handleNeedHelp}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  Get Help Now
                </Button>
              </CardContent>
            </Card>

            {/* I Can Help Card */}
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <HandHeart className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">I Can Help</CardTitle>
                <CardDescription className="text-base mt-2">
                  View map and offer assistance to those in need
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={handleCanHelp}
                  variant="secondary"
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  View Requests
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Your safety and privacy are our priority. All information is securely handled.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Need Help view - Choose between Individual or Group
  if (viewMode === 'need-help') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Button onClick={handleBack} variant="ghost" className="mb-4">
              ← Back
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">I Need Help</h1>
            <p className="text-lg md:text-xl text-gray-600">
              Are you requesting help as an individual or as a group?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Individual Card */}
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  I'm an Individual
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Request help for yourself or your family
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={handleIndividual}
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  Continue as Individual
                </Button>
              </CardContent>
            </Card>

            {/* Group/Camp Card */}
            <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">We're a Group</CardTitle>
                <CardDescription className="text-base mt-2">
                  Register your camp or group and share your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  onClick={handleGroup}
                  variant="secondary"
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                >
                  Continue as Group
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return null
}
