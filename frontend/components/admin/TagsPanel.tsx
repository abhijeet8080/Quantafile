'use client'

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { api } from "@/lib/axios";
import { TagType } from "@/types/admin";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ConfirmDialog } from "../ConfirmDialog";
import { Trash2, Edit3 } from "lucide-react";

export function TagsPanel() {
  const [tags, setTags] = useState<TagType[]>([]);
  const [editing, setEditing] = useState<TagType | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchTags = async () => {
    try {
      const { data } = await api<TagType[]>('/admin/tags', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTags(data);
    } catch (e) {
      console.error('Failed to fetch tags', e);
    }
  };

  useEffect(() => {
    fetchTags();
  });

  const createTag = async () => {
    if (!name.trim()) return alert('Name required');
    try {
      await api.post('/admin/tags', { name, description: desc }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setName('');
      setDesc('');
      setCreateOpen(false);
      fetchTags();
    } catch (e) {
      console.error(e);
    }
  };

  const updateTag = async () => {
    if (!editing) return;
    if (!editing.name.trim()) return alert('Name required');
    try {
      await api.put(`/admin/tags/${editing._id}`, { name: editing.name, description: editing.description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditing(null);
      fetchTags();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteTag = async (id: string) => {
    try {
      await api.delete(`/admin/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTags();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card
      className="
        p-6 rounded-2xl
        backdrop-blur-lg bg-white/70 dark:bg-zinc-900/60
        shadow-lg shadow-purple-500/20
        transition-all duration-300 ease-in-out
        hover:scale-[1.01] hover:shadow-xl
      "
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
          Tags
        </h3>
        <Button
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:brightness-110"
          onClick={() => setCreateOpen(true)}
          aria-label="Create new tag"
        >
          Create Tag
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-purple-300/30 shadow-md shadow-purple-300/20">
        <Table className="min-w-full">
          <TableHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-t-2xl">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((t) => (
              <TableRow
                key={t._id}
                className="
                  hover:scale-[1.02]
                  hover:shadow-lg
                  transition-transform duration-300 ease-in-out
                  cursor-default
                  even:bg-white/50 odd:bg-white/30 dark:even:bg-zinc-900/40 dark:odd:bg-zinc-900/30
                "
              >
                <TableCell className="font-medium text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">
                  {t.name}
                </TableCell>
                <TableCell className="max-w-[400px] truncate text-muted-foreground">
                  {t.description}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-2xl flex items-center gap-1 text-purple-600 hover:bg-purple-100"
                      onClick={() => setEditing(t)}
                      aria-label={`Edit tag ${t.name}`}
                    >
                      <Edit3 size={14} />
                      Edit
                    </Button>
                    <ConfirmDialog
                      trigger={
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1 rounded-2xl"
                          aria-label={`Delete tag ${t.name}`}
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      }
                      title="Delete Tag?"
                      description={`This will permanently delete the tag "${t.name}".`}
                      confirmText="Delete"
                      onConfirm={() => deleteTag(t._id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Tag Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="rounded-2xl bg-white/90 dark:bg-zinc-900/80 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-purple-600">
              Create Tag
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
            />
            <Input
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <DialogFooter className="space-x-2">
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:brightness-110"
              onClick={createTag}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="rounded-2xl bg-white/90 dark:bg-zinc-900/80 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-purple-600">
              Edit Tag
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <Input
              value={editing?.name || ''}
              onChange={(e) =>
                setEditing((s) => (s ? { ...s, name: e.target.value } : s))
              }
              className="rounded-xl"
            />
            <Input
              value={editing?.description || ''}
              onChange={(e) =>
                setEditing((s) => (s ? { ...s, description: e.target.value } : s))
              }
              className="rounded-xl"
            />
          </div>
          <DialogFooter className="space-x-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:brightness-110"
              onClick={updateTag}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
