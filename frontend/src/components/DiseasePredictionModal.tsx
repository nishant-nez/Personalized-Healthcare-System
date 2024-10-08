import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { DiseasePredictionI } from "@/pages/Home";
import { Textarea } from "@/components/ui/textarea"


const DiseasePredictionModal = ({ modalOpen, setModalOpen, data }: { modalOpen: boolean, setModalOpen: (open: boolean) => void, data: DiseasePredictionI | null }) => {
    if (data !== null) return (
        <Dialog open={modalOpen} onOpenChange={setModalOpen} >
            <DialogContent className="sm:max-w-[1000px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                <DialogHeader className="text-center sm:text-center">
                    <DialogTitle className="font-bold text-3xl">Disease Prediction</DialogTitle>
                    <DialogDescription>
                        Follow these to live a healthy lifestyle.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 items-center mr-20">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Disease
                        </Label>
                        <Input
                            id="name"
                            readOnly
                            value={data.Disease}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            readOnly
                            value={data.Description}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="diet" className="text-right">
                            Diet
                        </Label>
                        <Textarea
                            id="diet"
                            readOnly
                            value={data.Diet.join(', ')}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="medication" className="text-right">
                            Medications
                        </Label>
                        <Textarea
                            id="medication"
                            readOnly
                            value={data.Medications.join(', ')}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="precautions" className="text-right">
                            Precautions
                        </Label>
                        <Textarea
                            id="precautions"
                            readOnly
                            value={data.Precautions.join(', ')}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="workouts" className="text-right">
                            Workouts
                        </Label>
                        <Textarea
                            id="workouts"
                            readOnly
                            value={data.Workouts.join(', ')}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="severity" className="text-right">
                            Symptoms Severity
                        </Label>
                        <div
                            id="severity"
                            className="col-span-3 flex gap-3 text-sm"
                        >
                            {
                                Object.entries(data.Severity).map(([key, value]) => {
                                    if (Number(value) === 1) return <div key={key} className="bg-green-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                    if (Number(value) === 2) return <div key={key} className="bg-blue-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                    if (Number(value) === 3) return <div key={key} className="bg-yellow-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                    if (Number(value) === 4) return <div key={key} className="bg-orange-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                    if (Number(value) === 5) return <div key={key} className="bg-red-500 text-white p-2 rounded-lg">{key} ({value})</div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={() => setModalOpen(false)}>OK</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DiseasePredictionModal;