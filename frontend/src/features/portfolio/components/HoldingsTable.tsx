import type { Holding } from "../types/holdings";

import HoldingRow from "./HoldingRow";

type HoldingsTableProps = {
  holdings: Holding[];
  updatingHoldingId?: number;
  deletingHoldingId?: number;
  onEdit: (holding: Holding) => void;
  onDelete: (holding: Holding) => void;
};

const HoldingsTable = ({
  holdings,
  updatingHoldingId,
  deletingHoldingId,
  onEdit,
  onDelete,
}: HoldingsTableProps) => {
  return (
    <div className="holdings-table-wrapper">
      <table className="holdings-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Shares</th>
            <th>Average Price</th>
            <th>Latest Price</th>
            <th>Market Value</th>
            <th>Gain/Loss</th>
            <th>Purchased</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {holdings.map((holding) => (
            <HoldingRow
              key={holding.id}
              holding={holding}
              isUpdating={updatingHoldingId === holding.id}
              isDeleting={deletingHoldingId === holding.id}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;
