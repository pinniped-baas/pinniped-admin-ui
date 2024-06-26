import { useState } from "react";
import styled from "styled-components";

import {
  User,
  Folder,
  Edit,
  Copy,
  Eye,
  ChevronDown,
  ChevronRight,
} from "react-feather";

const TableCard = ({
  tables,
  table,
  chooseTable,
  relatedTable,
  setRelatedTable,
}) => {
  const [showSystemFields, setShowSystemFields] = useState(false);
  const [showCustomFields, setShowCustomFields] = useState(false);
  const [showApiRules, setShowApiRules] = useState(false);
  const [viewAll, setViewAll] = useState(false);

  return (
    <div
      className={`table-card ${
        relatedTable === table.name ? "highlight-relation" : ""
      }`}
    >
      <div className="table-card-header">
        <div className="name">
          {table.name === "users" || table.name === "_admins" ? (
            <User size={15}></User>
          ) : (
            <Folder size={15}></Folder>
          )}
          <h3>{table.name}</h3>
        </div>
        <div className="actions">
          <Edit
            className="edit-icon"
            icon={`fa-light fa-edit`}
            onClick={() => chooseTable(table.name)}
          />
          <Copy
            icon={`fa-light fa-copy`}
            className="copy"
            onClick={() => {
              window.navigator.clipboard.writeText(table.id);
            }}
          />
          <Eye
            icon="fa-light fa-eye"
            className="view"
            onClick={() => {
              if (!viewAll) {
                setShowApiRules(true);
                setShowCustomFields(true);
                setShowSystemFields(true);
                setViewAll(true);
              } else {
                setShowApiRules(false);
                setShowCustomFields(false);
                setShowSystemFields(false);
                setViewAll(false);
              }
            }}
          />
        </div>
      </div>
      <div className="table">
        <div
          className="fields-header"
          onClick={(e) => {
            e.stopPropagation();
            setShowSystemFields(!showSystemFields);
          }}
        >
          <h2>System Fields</h2>
          {showSystemFields ? (
            <ChevronDown size={15} />
          ) : (
            <ChevronRight size={15} />
          )}
        </div>
        {!showSystemFields ? (
          ""
        ) : (
          <>
            <div className="table-card-system">
              <div className="table-card-column">
                <span>ID</span>
                <span>String</span>
              </div>
              <div className="table-card-column">
                <span>Created At</span>
                <span>Date</span>
              </div>
              <div className="table-card-column">
                <span>Updated At</span>
                <span>Date</span>
              </div>
              {table.type !== "auth" ? (
                ""
              ) : (
                <>
                  <div className="table-card-column">
                    <span>Username</span>
                    <span>String</span>
                  </div>
                  <div className="table-card-column">
                    <span>Password</span>
                    <span>String</span>
                  </div>
                  <div className="table-card-column">
                    <span>Role</span>
                    <span>String</span>
                  </div>
                </>
              )}
            </div>
          </>
        )}
        <div
          className="fields-header"
          onClick={(e) => {
            e.stopPropagation();
            setShowCustomFields(!showCustomFields);
          }}
        >
          <h2>Custom Fields</h2>
          {showCustomFields ? (
            <ChevronDown size={15} />
          ) : (
            <ChevronRight size={15} />
          )}
        </div>
        {!showCustomFields ? (
          ""
        ) : (
          <>
            <div className="table-card-schema">
              {table.columns.length === 0 ? (
                <span className="no-custom-fields">No custom fields</span>
              ) : (
                table.columns.map((column) => (
                  <div
                    key={column.name}
                    className="table-card-column"
                    onMouseOver={(e) => {
                      e.stopPropagation();
                      if (column.type === "relation") {
                        const relatedTable = tables.find(
                          (table) => table.id === column.options.tableId
                        ).name;
                        setRelatedTable(relatedTable);
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      setRelatedTable(null);
                    }}
                  >
                    <span>{column.name}</span>
                    <span>{column.type}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
        <div
          className="fields-header"
          onClick={() => setShowApiRules(!showApiRules)}
        >
          <h2>API Rules</h2>
          {showApiRules ? (
            <ChevronDown size={15} />
          ) : (
            <ChevronRight size={15} />
          )}
        </div>
        {!showApiRules ? (
          ""
        ) : (
          <>
            <div className="api-rules">
              <div className="get-all-rule">
                <span>Get All</span>
                <span>{table.getAllRule}</span>
              </div>
              <div className="get-all-rule">
                <span>Get One</span>
                <span>{table.getOneRule}</span>
              </div>
              <div className="get-all-rule">
                <span>Create</span>
                <span>{table.createRule}</span>
              </div>
              <div className="get-all-rule">
                <span>Update</span>
                <span>{table.updateRule}</span>
              </div>
              <div className="get-all-rule">
                <span>Delete</span>
                <span>{table.deleteRule}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function TableDashboard({ tables, chooseTable }) {
  const [relatedTable, setRelatedTable] = useState(null);

  return (
    <Container className="table-dashboard">
      {tables
        .filter((table) => table.name !== "admins")
        .map((table) => (
          <TableCard
            key={table.name}
            tables={tables}
            table={table}
            chooseTable={chooseTable}
            relatedTable={relatedTable}
            setRelatedTable={setRelatedTable}
          />
        ))}
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  padding: 30px;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 30px;

  & .table-card {
    width: 200px;
    height: 350px;

    border: 1px solid var(--pk);
    border-radius: var(--min-radius);
    padding: 15px;
    cursor: pointer;
    box-shadow: var(--shadow-3);
    background-color: white;
    &.highlight-relation {
      background-color: var(--highlight);
    }

    &:hover {
      border: 1px solid var(--light-gray);
    }

    & .table-card-header {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      display: flex;
      justify-content: space-between;
      padding-bottom: 5px;
      border-bottom: 1px solid var(--light-gray);
      margin-bottom: 15px;

      & div {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      & .actions {
        & * {
          transition: 0.2s all;
        }

        & *:active {
          transform: scale(0.9);
        }
        & .edit-icon {
          &:hover {
            color: var(--green);
          }
        }

        & .copy {
          &:hover {
            color: var(--blue);
          }
        }
        & .view {
          &:hover {
            color: var(--sage);
          }
        }
      }
    }
    & .table {
      height: 300px;
      overflow-y: scroll;
      & .fields-header {
        display: flex;
        width: 100%;
        justify-content: space-between;
        margin-bottom: 10px;

        border-bottom: 2px solid var(--light-gray);
        & h2 {
          font-size: 1.1rem;
          color: var(--light-gray);
          font-weight: 700;
        }
      }

      & .table-card-schema,
      .table-card-system {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin: 10px 0;
        margin-left: 5px;

        & .no-custom-fields {
          font-size: 0.9rem;
          color: var(--text-color);
        }

        & .table-card-column {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          color: var(--text-color);
          padding: 2px 0;

          &:hover {
            border-bottom: 2px solid var(--pk);
            font-weight: 600;
          }
        }
      }

      & .api-rules {
        & div {
          display: flex;
          justify-content: space-between;
          color: var(--text-color);
          margin: 5px 0;
        }
      }
    }
  }
`;
