import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Upload, Shield, User, Calendar, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewPatientRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordAdded: (record: any) => void;
}

export const NewPatientRecordDialog = ({ open, onOpenChange, onRecordAdded }: NewPatientRecordDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: "",
    recordType: "",
    accessLevel: "full" as "full" | "restricted" | "view-only",
    description: "",
    file: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recordTypes = [
    "Lab Results - Blood Work",
    "MRI Scan Report", 
    "X-Ray Images",
    "Prescription History",
    "Surgical Notes",
    "Consultation Notes",
    "Vaccination Records",
    "Allergy Information",
    "Insurance Documents",
    "Discharge Summary"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.recordType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate record creation and encryption process
    setTimeout(() => {
      const newRecord = {
        id: Math.random().toString(36).substr(2, 9),
        patientName: formData.patientName,
        recordType: formData.recordType,
        dateCreated: new Date().toISOString().split('T')[0],
        encryptionStatus: "processing" as const,
        accessLevel: formData.accessLevel,
        fileSize: formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(1)} MB` : "N/A"
      };

      onRecordAdded(newRecord);
      
      toast({
        title: "Record Created Successfully",
        description: "Patient record has been encrypted and added to the system.",
      });

      // Reset form
      setFormData({
        patientName: "",
        recordType: "",
        accessLevel: "full",
        description: "",
        file: null
      });

      setIsSubmitting(false);
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-medical-blue" />
            <span>Add New Patient Record</span>
          </DialogTitle>
          <DialogDescription>
            Create and encrypt a new patient health record
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Patient Information</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  placeholder="Enter patient full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recordType">Record Type *</Label>
                <Select
                  value={formData.recordType}
                  onValueChange={(value) => setFormData({ ...formData, recordType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security Settings</span>
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="accessLevel">Access Level</Label>
              <Select
                value={formData.accessLevel}
                onValueChange={(value: "full" | "restricted" | "view-only") => 
                  setFormData({ ...formData, accessLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Access - Complete read/write permissions</SelectItem>
                  <SelectItem value="restricted">Restricted - Limited access permissions</SelectItem>
                  <SelectItem value="view-only">View Only - Read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/30 p-3 rounded-lg border border-medical-light">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-medical-green" />
                <span className="text-sm font-medium">Encryption Details</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All records are automatically encrypted using AES-256 encryption with FHE (Fully Homomorphic Encryption) 
                for maximum security and privacy compliance.
              </p>
            </div>
          </div>

          <Separator />

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Record Content</span>
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional notes or description for this record..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload File (Optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label 
                  htmlFor="file" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-medical-light rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, JPG, PNG (MAX. 50MB)</p>
                  </div>
                  <input 
                    id="file" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {formData.file && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                  <FileText className="h-4 w-4" />
                  <span>{formData.file.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {(formData.file.size / 1024 / 1024).toFixed(1)} MB
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-medical-blue hover:bg-medical-blue/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Shield className="mr-2 h-4 w-4 animate-spin" />
                  Encrypting Record...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Create Encrypted Record
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};