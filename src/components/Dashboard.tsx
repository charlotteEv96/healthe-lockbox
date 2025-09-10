import { useState } from "react";
import { FileText, Shield, Users, Activity, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientRecordCard } from "./PatientRecordCard";
import { ViewRecordDialog } from "./ViewRecordDialog";
import { NewPatientRecordDialog } from "./NewPatientRecordDialog";
import { useToast } from "@/hooks/use-toast";

const mockRecords = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    recordType: "Lab Results - Blood Work",
    dateCreated: "2024-01-15",
    encryptionStatus: "encrypted" as const,
    accessLevel: "full" as const,
    fileSize: "2.4 MB"
  },
  {
    id: "2", 
    patientName: "Michael Chen",
    recordType: "MRI Scan Report",
    dateCreated: "2024-01-14",
    encryptionStatus: "encrypted" as const,
    accessLevel: "restricted" as const,
    fileSize: "15.7 MB"
  },
  {
    id: "3",
    patientName: "Emily Rodriguez",
    recordType: "Prescription History",
    dateCreated: "2024-01-13",
    encryptionStatus: "processing" as const,
    accessLevel: "view-only" as const,
    fileSize: "850 KB"
  },
  {
    id: "4",
    patientName: "David Thompson",
    recordType: "Surgical Notes",
    dateCreated: "2024-01-12",
    encryptionStatus: "pending" as const,
    accessLevel: "full" as const,
    fileSize: "5.2 MB"
  }
];

const stats = [
  {
    title: "Total Records",
    value: "1,247",
    icon: FileText,
    trend: "+12% from last month",
    color: "text-medical-blue"
  },
  {
    title: "Encrypted Files",
    value: "1,198",
    icon: Shield,
    trend: "96.1% encryption rate",
    color: "text-medical-green"
  },
  {
    title: "Active Patients",
    value: "324",
    icon: Users,
    trend: "+8 new this week",
    color: "text-security-gold"
  },
  {
    title: "System Health",
    value: "99.9%",
    icon: Activity,
    trend: "All systems operational",
    color: "text-security-purple"
  }
];

export const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState(mockRecords);
  const [selectedRecord, setSelectedRecord] = useState<typeof mockRecords[0] | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [newRecordDialogOpen, setNewRecordDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleViewRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
      setViewDialogOpen(true);
    }
  };

  const handleAddRecord = (newRecord: any) => {
    setRecords(prev => [newRecord, ...prev]);
  };

  const filteredRecords = records.filter(record =>
    record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.recordType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-medical-light hover:shadow-medical transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Patient Records</h2>
              <p className="text-muted-foreground">
                Secure, encrypted health data management system
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue"
              />
              <Button 
                onClick={() => setNewRecordDialogOpen(true)}
                className="bg-medical-blue hover:bg-medical-blue/90 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Record
              </Button>
            </div>
          </div>

          {/* Records Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecords.map((record) => (
              <PatientRecordCard
                key={record.id}
                record={record}
                onViewRecord={handleViewRecord}
              />
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No records found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria.
              </p>
            </div>
          )}
        </div>

        {/* Dialogs */}
        <ViewRecordDialog
          record={selectedRecord}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
        
        <NewPatientRecordDialog
          open={newRecordDialogOpen}
          onOpenChange={setNewRecordDialogOpen}
          onRecordAdded={handleAddRecord}
        />
      </div>
    </div>
  );
};