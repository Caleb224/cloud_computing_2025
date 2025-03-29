import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";

export default function Page() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-10 h-full">
            <div className="col-span-1">
                <Card className="min-h-min">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Your Documents
                        </CardTitle>
                    </CardHeader>
                    <Separator/>
                    <CardContent>

                    </CardContent>
                </Card>
            </div>
            <div className="sm:col-start-2">
                content
            </div>
        </div>
    )
}