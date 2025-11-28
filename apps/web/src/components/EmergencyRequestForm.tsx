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
import { Input } from 'apps/web/src/components/ui/input'
import { Label } from 'apps/web/src/components/ui/label'
import { Textarea } from 'apps/web/src/components/ui/textarea'
import LocationPicker from './LocationPicker'
import { ICreateHelpRequest } from '@nx-mono-repo-deployment-test/shared/src/interfaces/help-request/ICreateHelpRequest'
import {
  HelpRequestCategory,
  Urgency,
  ContactType,
} from '@nx-mono-repo-deployment-test/shared/src/enums'

interface EmergencyRequestFormProps {
  onSubmit: (data: ICreateHelpRequest) => Promise<{ success: boolean; data?: any; error?: string }>
  onCancel?: () => void
  isGroup?: boolean
}

type FormStep = 1 | 2 | 3 | 4

interface FormData {
  name: string
  numberOfPeople: string
  age: string
  gpsLocation: { lat: number; lng: number }
  contactNumber: string
  notes: string
  requestedItems: string
  urgent: boolean
}

export default function EmergencyRequestForm({
  onSubmit,
  onCancel,
  isGroup = false,
}: EmergencyRequestFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FormStep>(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    numberOfPeople: '',
    age: '',
    gpsLocation: { lat: 7.8731, lng: 80.7718 },
    contactNumber: '',
    notes: '',
    requestedItems: '',
    urgent: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData({ ...formData, gpsLocation: { lat, lng } })
  }

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.name.trim()) {
        setError('Name is required')
        return
      }
      if (!formData.numberOfPeople.trim()) {
        setError('Number of people is required')
        return
      }
      if (!formData.gpsLocation.lat || !formData.gpsLocation.lng) {
        setError('GPS location is required')
        return
      }
    }
    setError(null)
    setCurrentStep((prev) => (prev + 1) as FormStep)
  }

  const handleBack = () => {
    setError(null)
    if (currentStep === 1) {
      if (onCancel) {
        onCancel()
      } else {
        router.push('/')
      }
    } else {
      setCurrentStep((prev) => (prev - 1) as FormStep)
    }
  }

  const handlePublish = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Map form data to ICreateHelpRequest
      const helpRequestData: ICreateHelpRequest = {
        lat: formData.gpsLocation.lat,
        lng: formData.gpsLocation.lng,
        category: formData.requestedItems.includes('food') || formData.requestedItems.includes('water')
          ? HelpRequestCategory.FOOD_WATER
          : HelpRequestCategory.OTHER,
        urgency: formData.urgent ? Urgency.HIGH : Urgency.MEDIUM,
        shortNote: formData.notes || `Name: ${formData.name}, People: ${formData.numberOfPeople}${formData.age ? `, Age: ${formData.age}` : ''}`,
        approxArea: `${formData.gpsLocation.lat}, ${formData.gpsLocation.lng}`,
        contactType: formData.contactNumber ? ContactType.PHONE : ContactType.NONE,
        contact: formData.contactNumber || undefined,
      }

      const response = await onSubmit(helpRequestData)
      
      if (response.success && response.data?.id) {
        setRequestId(response.data.id.toString())
        setCurrentStep(4)
      } else {
        setError(response.error || 'Failed to submit request')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDontPublish = () => {
    router.push('/')
  }

  // Step 1: Emergency Request Form
  if (currentStep === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Emergency Request Form</CardTitle>
            <CardDescription>Page 1 of 4</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPeople">Number of People *</Label>
              <Input
                id="numberOfPeople"
                type="number"
                value={formData.numberOfPeople}
                onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
                placeholder="Enter number of people"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age (if less than 18, specify age)</Label>
              <Input
                id="age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="e.g., 15 or Adult"
              />
            </div>

            <div className="space-y-2">
              <Label>GPS Current Location *</Label>
              <LocationPicker
                onLocationChange={handleLocationChange}
                initialLat={formData.gpsLocation.lat}
                initialLng={formData.gpsLocation.lng}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact number (optional)</Label>
              <Input
                id="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="Enter contact number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestedItems">Requested Items</Label>
              <Input
                id="requestedItems"
                value={formData.requestedItems}
                onChange={(e) => setFormData({ ...formData, requestedItems: e.target.value })}
                placeholder="e.g., torch, candle, matches, tissues"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgent"
                  checked={formData.urgent}
                  onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="urgent" className="cursor-pointer">
                  Urgent (e.g., medical emergency)
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Add notes (optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Enter any additional notes"
                rows={3}
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 2: Emergency Request Data (Summary)
  if (currentStep === 2) {
    const ageNum = formData.age ? parseInt(formData.age) : null
    const totalPeople = parseInt(formData.numberOfPeople) || 0
    const kids = ageNum !== null && ageNum < 18 ? formData.numberOfPeople : '0'
    const adults = ageNum !== null && ageNum < 18 
      ? Math.max(0, totalPeople - parseInt(kids)).toString()
      : formData.numberOfPeople

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Emergency Request Data</CardTitle>
            <CardDescription>Page 2 of 4</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <strong>Information:</strong>
              </div>
              <div className="space-y-2 pl-4">
                <div>1) Requested food & water</div>
                <div>2) Requested items: {formData.requestedItems || 'None specified'}</div>
                <div>3) Kids (less than 18): {kids}</div>
                <div>4) Adults (more than 18): {adults}</div>
                <div>5) Location: [{formData.gpsLocation.lat}, {formData.gpsLocation.lng}]</div>
                <div>6) Urgent: {formData.urgent ? 'Yes (e.g., medical emergency)' : 'No'}</div>
                {formData.contactNumber && (
                  <div>7) Contact number: {formData.contactNumber}</div>
                )}
                {formData.notes && (
                  <div>8) Notes: {formData.notes}</div>
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 3: Confirm Data
  if (currentStep === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Emergency Request Done</CardTitle>
            <CardDescription>Page 3 of 4</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div>
                <strong>Confirm Data</strong>
              </div>
              <div className="text-lg">
                Do you want to publish this request?
              </div>
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDontPublish}
                disabled={isSubmitting}
              >
                No
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : 'Yes'}
              </Button>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="ghost" onClick={handleBack}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Step 4: Success
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-600">
            Emergency Request Done (Success)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">✅</div>
            <div className="text-lg">
              Your request submitted successfully.
            </div>
            {requestId && (
              <div className="text-base">
                Your request ID is <strong>{requestId}</strong>
              </div>
            )}
            <div className="text-sm text-gray-600">
              Emergency Support: [Number]
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
            <Button
              type="button"
              onClick={() => router.push('/help')}
            >
              View All Requests
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

