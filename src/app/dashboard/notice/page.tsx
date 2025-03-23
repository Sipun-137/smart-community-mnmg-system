/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetAllNotice } from "@/services/NoticeService";
import { formatDistanceToNow } from "date-fns";

async function getNotices() {
  //   Example API call:
  const res = await GetAllNotice();
  console.log(res);
  if (res.success) {
    return res.data;
  } else {
    return [];
  }
}

export default async function NoticesPage() {
  const notices = await getNotices();
  console.log(notices);
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Notices</h1>

      {notices.length === 0 ? (
        <p className="text-muted-foreground">
          No notices available at this time.
        </p>
      ) : (
        <div className="grid gap-6">
          {notices.map((notice: any) => (
            <Card key={notice._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{notice.title}</CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(notice.date), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{notice.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
