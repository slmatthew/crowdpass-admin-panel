import { useEffect, useRef, useState } from "react";
import { ActionLog } from "@/types/models/ActionLog";
import { useApiClient } from "@/hooks/useApiClient";
import { actionLogLabels } from "@/constants/actionLogLabels";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Button } from "@/components/ui/Button";
import { useModals } from "@/context/ModalContext";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronDown } from "lucide-react";

export default function LogsPage() {
  const isMobile = useIsMobile();
  if(isMobile) return (
    <p className="text-gray-500">Для просмотра этой страницы потребуется компьютер</p>
  );

  const api = useApiClient();
  const containerRef = useRef<HTMLDivElement>(null);

  const { openModal } = useModals();

  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [manualPage, setManualPage] = useState("");

  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    actorId: "",
    action: "",
    targetType: "",
    from: "",
    to: "",
  });

  useEffect(() => {
    fetchLogs(1, true); // initial
    fetchActions();
  }, [pageSize]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });
  
    const el = containerRef.current;
    if (el) observer.observe(el);
  
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [logs, loading]);  

  async function fetchLogs(pageToLoad = page, replace = false) {
    if (loading) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append("page", pageToLoad.toString());
      params.append("pageSize", pageSize.toString());

      const res = await api.get<{ logs: ActionLog[]; total: number }>(
        `/admin/logs?${params.toString()}`
      );

      if (replace) {
        setLogs(res.data.logs);
      } else {
        setLogs((prev) => [...prev, ...res.data.logs]);
      }

      setTotal(res.data.total);
      setPage(pageToLoad);
      setHasMore(res.data.logs.length === pageSize);
    } catch (err) {
      console.error("Ошибка при загрузке логов", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchActions() {
    try {
      const res = await api.get<string[]>("/admin/logs/actions");
      setAvailableActions(res.data);
    } catch (err) {
      console.error("Ошибка при загрузке actions", err);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleReset() {
    setFilters({ actorId: "", action: "", targetType: "", from: "", to: "" });
    fetchLogs(1, true);
  }

  function handleApply() {
    fetchLogs(1, true);
  }

  function handleIntersect(entries: IntersectionObserverEntry[]) {
    if (entries[0].isIntersecting && hasMore && !loading) {
      fetchLogs(page + 1);
    }
  }

  function handlePageSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPageSize(Number(e.target.value));
    setPage(1);
    fetchLogs(1, true);
  }

  function handlePageJump() {
    const num = parseInt(manualPage);
    if (!isNaN(num) && num > 0 && num <= Math.ceil(total / pageSize)) {
      fetchLogs(num, true);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Логи действий</h1>

      <div className="bg-white rounded-md shadow p-4 flex flex-wrap gap-4 items-end">
        <input
          type="text"
          placeholder="ID пользователя"
          name="actorId"
          value={filters.actorId}
          onChange={handleInputChange}
          className="input"
        />
        <select
          name="action"
          value={filters.action}
          onChange={handleInputChange}
          className="select"
        >
          <option value="">Все действия</option>
          {availableActions.map((action) => (
            <option key={action} value={action}>
              {actionLogLabels[action] ?? action}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Сущность (Event, Organizer)"
          name="targetType"
          value={filters.targetType}
          onChange={handleInputChange}
          className="input"
        />
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleInputChange}
          className="input"
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleInputChange}
          className="input"
        />

        <button className="btn-primary" onClick={handleApply}>
          Применить
        </button>
        <button className="btn-secondary" onClick={handleReset}>
          Сброс
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Показано {logs.length} из {total}
        </div>

        <div className="flex gap-3 items-center">
          <label>На странице:</label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1"
          >
            {[10, 20, 50, 100].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="стр."
              value={manualPage}
              onChange={(e) => setManualPage(e.target.value)}
              className="w-16 px-2 py-1 border rounded"
            />
            <button onClick={handlePageJump} className="btn-secondary">
              Перейти
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-md shadow p-4">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Дата</th>
              <th className="text-left p-2">Пользователь</th>
              <th className="text-left p-2">Действие</th>
              <th className="text-left p-2">Объект</th>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Детали</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b">
                <td className="p-2">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="p-2">
                  <Button variant="outline" size="sm" onClick={() => openModal('user', log.actor)}>
                    {log.actor.firstName} {log.actor.lastName} (ID: {log.actor.id})
                  </Button>
                </td>
                <td className="p-2">{actionLogLabels[log.action] ?? log.action}</td>
                <td className="p-2">{log.targetType}</td>
                <td className="p-2">{log.targetId}</td>
                <td className="p-2">
                  <Disclosure as="div" defaultOpen={false}>
                    <DisclosureButton className="group flex w-full items-center justify-between">
                      <span>
                        Мета-данные
                      </span>
                      <ChevronDown className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                    </DisclosureButton>
                    <DisclosurePanel>
                      <pre className="max-w-[400px] whitespace-pre-wrap break-words text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        {JSON.stringify(log.metadata, null, 2)}
                      </pre>
                    </DisclosurePanel>
                  </Disclosure>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div className="text-center py-6 text-gray-400">Загрузка...</div>
        )}

        {!hasMore && !loading && (
          <div className="text-center py-6 text-gray-400">Конец списка</div>
        )}

        <div ref={containerRef} />
      </div>
    </div>
  );
}
