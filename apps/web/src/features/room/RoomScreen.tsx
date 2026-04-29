import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDemo } from "../../app/demo-context";
import { Badge, Button, Card, Field, Input, SectionHeading } from "../../components/ui";

export function RoomScreen() {
  const { items, role, room, members, addItem, updateItem, toggleItem, deleteItem } = useDemo();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const editingItem = useMemo(
    () => items.find((item) => item.id === editingItemId) ?? null,
    [editingItemId, items],
  );

  return (
    <div className="screen">
      <Card className="hero-card">
        <div className="room-hero">
          <SectionHeading
            eyebrow="Shared room"
            title={room.name}
            description="A scaffold-first room view with one reliable list, clear ownership rules, and predictable CRUD interactions."
          />

          <div className="room-hero__meta">
            <Badge tone="accent">{role}</Badge>
            <Badge tone="neutral">{members.length} people</Badge>
          </div>
        </div>

        <div className="summary-grid">
          <Card className="summary-card">
            <p className="info-title">Room ownership</p>
            <p className="muted-copy">
              Owners can rename, transfer ownership, and delete the room. Members can edit the list and
              leave.
            </p>
          </Card>

          <Card className="summary-card">
            <p className="info-title">Membership summary</p>
            <p className="muted-copy">
              {members.filter((member) => member.status === "active").length} active members and{" "}
              {members.filter((member) => member.status === "invited").length} pending invite.
            </p>
            <Link className="text-link" to="/room/room-family-1/members">
              Open members panel
            </Link>
          </Card>
        </div>
      </Card>

      <div className="room-grid">
        <Card>
          <SectionHeading
            eyebrow="Item CRUD"
            title="Shopping list"
            description="Soft tactile rows, dependable actions, and empty states that still feel friendly."
          />

          <form
            className="item-form"
            onSubmit={(event) => {
              event.preventDefault();

              if (editingItem) {
                updateItem(editingItem.id, {
                  name: name || editingItem.name,
                  quantity: quantity || editingItem.quantity,
                });
                setEditingItemId(null);
              } else if (name && quantity) {
                addItem({ name, quantity });
              }

              setName("");
              setQuantity("");
            }}
          >
            <Field label="Item name">
              <Input onChange={(event) => setName(event.target.value)} value={name} />
            </Field>
            <Field label="Quantity">
              <Input onChange={(event) => setQuantity(event.target.value)} value={quantity} />
            </Field>
            <Button type="submit">{editingItem ? "Save item" : "Add item"}</Button>
          </form>

          <div className="stack-md">
            {items.length === 0 ? (
              <div className="empty-state">
                <p>No items yet.</p>
                <span>Start with produce, dairy, or tonight's dinner plan.</span>
              </div>
            ) : (
              items.map((item) => (
                <article key={item.id} className={item.isChecked ? "item-row item-row--checked" : "item-row"}>
                  <button
                    aria-label={`Toggle ${item.name}`}
                    className={item.isChecked ? "checkmark checkmark--active" : "checkmark"}
                    onClick={() => toggleItem(item.id)}
                    type="button"
                  />

                  <div className="item-row__body">
                    <strong>{item.name}</strong>
                    <span>
                      {item.quantity} • updated by {item.updatedBy}
                    </span>
                  </div>

                  <div className="item-row__actions">
                    <Button
                      onClick={() => {
                        setEditingItemId(item.id);
                        setName(item.name);
                        setQuantity(item.quantity);
                      }}
                      type="button"
                      variant="ghost"
                    >
                      Edit
                    </Button>
                    <Button onClick={() => deleteItem(item.id)} type="button" variant="danger">
                      Delete
                    </Button>
                  </div>
                </article>
              ))
            )}
          </div>
        </Card>

        <Card>
          <SectionHeading
            eyebrow="Safe interactions"
            title="Pending and failure states"
            description="These notes mirror the Figma direction without wiring real transport yet."
          />

          <ul className="feature-list">
            <li>Disable repeated submits during add, edit, login, signup, and join actions.</li>
            <li>Keep auth and invite errors human-readable and tied to the right screen.</li>
            <li>Preserve role-based restrictions when backend services arrive.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
