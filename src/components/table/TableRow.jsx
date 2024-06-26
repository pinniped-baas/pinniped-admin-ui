import { useState } from "react";
import styled from "styled-components";

import TableCell from "./TableCell";
import Checkbox from "../utils/Checkbox.jsx";

import { useModalContext } from "../../hooks/useModal";


import { ArrowRight } from "react-feather";

export default function TableRow({
  table,
  row,
  setRows,
  selectedRows,
  setSelectedRows,
  tableIsScrolled,
}) {
  const [hovering, setHovering] = useState(false);

  const {
    actionCreators: { editUser, editRecord },
  } = useModalContext();

  return (
    table && (
      <TableRowWrapper
        className={hovering ? "hovering" : ""}
        onClick={() => {
          if (table.type === "auth") {
            editUser({ table, row, setRows });
          } else editRecord({ table, row, setRows });
        }}
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <td
          className={`sticky-col ${tableIsScrolled ? "shadow" : ""} ${
            hovering ? "hovering" : ""
          }`}
        >
          <Checkbox
            checked={selectedRows.includes(row.id)}
            onChange={() => {
              setSelectedRows((prev) => {
                if (prev.includes(row.id)) {
                  return prev.filter((id) => id !== row.id);
                } else {
                  return [...prev, row.id];
                }
              });
            }}
          />
        </td>
        <TableCell
          table={table}
          column={{ type: "pk", name: "id" }}
          row={row}
        />
        {table.type === "auth" ? (
          <TableCell
            table={table}
            column={{ type: "username", name: "username" }}
            row={row}
          />
        ) : (
          ""
        )}
        {table.columns
          .filter((column) => {
            return column.show;
          })
          .map((column) => {
            return (
              <TableCell
                key={`${column.name}-${row.id}`}
                table={table}
                column={column}
                row={row}
                setRows={setRows}
              />
            );
          })}
        <TableCell
          table={table}
          column={{ type: "created_at", name: "created_at" }}
          row={row}
        />
        <TableCell
          table={table}
          column={{ type: "updated_at", name: "updated_at" }}
          row={row}
        />
        <td className={`right-arrow ${hovering ? "hovering" : ""}`}>
          <ArrowRight size={10} />
        </td>
      </TableRowWrapper>
    )
  );
}

const TableRowWrapper = styled.tr`
  border-bottom: 1px solid var(--pk);
  cursor: pointer;
  z-index: 80;
  height: 45px;

  &.hovering {
    background-color: var(--secondary-background);
  }

  & .right-arrow {
    width: 50px;
    text-align: center;
    color: var(--text-color);
  }
`;
