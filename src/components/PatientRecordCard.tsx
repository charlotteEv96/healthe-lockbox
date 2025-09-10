import { FileText, Shield, Eye, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PatientRecord {
  id: string;
  patientName: string;
  recordType: string;
  dateCreated: string;
  encryptionStatus: "encrypted" | "pending" | "processing";
  accessLevel: "full" | "restricted" | "view-only";
  fileSize: string;
}

interface PatientRecordCardProps {
  record: PatientRecord;
  onViewRecord: (id: string) => void;
}

export const PatientRecordCard = ({ record, onViewRecord }: PatientRecordCardProps) => {
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
    <Card className="hover:shadow-medical transition-all duration-300 bg-gradient-card border-medical-light">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-medical-light">
              <FileText className="h-5 w-5 text-medical-blue" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{record.recordType}</h3>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{record.patientName}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {getEncryptionBadge(record.encryptionStatus)}
            {getAccessBadge(record.accessLevel)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{record.dateCreated}</span>
            </div>
            <span>•</span>
            <span>{record.fileSize}</span>
          </div>
          
          <Button
            size="sm"
            onClick={() => onViewRecord(record.id)}
            className="bg-medical-blue hover:bg-medical-blue/90 text-white"
          >
            <Eye className="mr-1 h-3 w-3" />
            View Record
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};