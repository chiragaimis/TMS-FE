import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { mockFees } from '../utils/mockData';
import { formatCurrency, formatDate } from '../utils/helpers';

export function Fees() {
  const totalCollected = mockFees.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = mockFees.filter((f) => f.status === 'pending').reduce((sum, f) => sum + f.amount, 0);

  const getFeeStatusBadge = (status: string) => {
    const variants = {
      paid: 'success',
      pending: 'warning',
      overdue: 'error',
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        <p className="text-gray-600 mt-1">Track and collect student fees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Collected</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(totalCollected)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending Fees</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{formatCurrency(totalPending)}</p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{formatCurrency(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-50">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Fee Records</h3>
          <Button>Collect Fee</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFees.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell className="font-medium">{fee.studentName}</TableCell>
                <TableCell>{fee.month}</TableCell>
                <TableCell>{formatCurrency(fee.amount)}</TableCell>
                <TableCell>{formatDate(fee.dueDate)}</TableCell>
                <TableCell>{fee.paidDate ? formatDate(fee.paidDate) : '-'}</TableCell>
                <TableCell>{getFeeStatusBadge(fee.status)}</TableCell>
                <TableCell>
                  {fee.status === 'pending' && (
                    <Button size="sm">Collect</Button>
                  )}
                  {fee.status === 'paid' && (
                    <Button size="sm" variant="secondary">Receipt</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
