import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Shield, User, Calendar, Download, Lock } from "lucide-react";

interface PatientRecord {
  id: string;
  patientName: string;
  recordType: string;
  dateCreated: string;
  encryptionStatus: "encrypted" | "pending" | "processing";
  accessLevel: "full" | "restricted" | "view-only";
  fileSize: string;
}

interface ViewRecordDialogProps {
  record: PatientRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewRecordDialog = ({ record, open, onOpenChange }: ViewRecordDialogProps) => {
  if (!record) return null;

  const getEncryptionBadge = (status: string) => {
    switch (status) {
      case "encrypted":
        return (
          <Badge className="bg-medical-green text-white border-0">
            <Shield className="mr-1 h-3 w-3" />
            Encrypted
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-security-gold text-security-gold">
            <Shield className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="border-security-purple text-security-purple">
            <Shield className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAccessBadge = (level: string) => {
    const colors = {
      full: "bg-primary text-white",
      restricted: "bg-secondary text-white", 
      "view-only": "bg-muted text-muted-foreground"
    };
    
    return (
      <Badge className={colors[level as keyof typeof colors] || colors["view-only"]}>
        {level.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-medical-blue" />
            <span>Patient Record Details</span>
          </DialogTitle>
          <DialogDescription>
            Secure encrypted health record information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Record Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">{record.recordType}</h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{record.patientName}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              {getEncryptionBadge(record.encryptionStatus)}
              {getAccessBadge(record.accessLevel)}
            </div>
          </div>

          <Separator />

          {/* Record Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date Created</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{record.dateCreated}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">File Size</label>
              <span className="text-sm">{record.fileSize}</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Record ID</label>
              <span className="text-sm font-mono">{record.id}</span>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Security Level</label>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-medical-green" />
                <span className="text-sm">AES-256 Encryption</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Record Content Preview */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Record Preview</label>
            <div className="bg-muted/30 p-4 rounded-lg border border-medical-light">
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <div className="text-center space-y-2">
                  <Lock className="h-8 w-8 mx-auto" />
                  <p className="text-sm">Encrypted content requires secure decryption</p>
                  <p className="text-xs">Use the download button to access full record</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <div className="space-x-2">
              <Button 
                variant="outline"
                className="border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Record
              </Button>
              <Button className="bg-medical-green hover:bg-medical-green/90 text-white">
                <Shield className="mr-2 h-4 w-4" />
                Decrypt & View
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};