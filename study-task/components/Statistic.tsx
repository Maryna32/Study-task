"use client";
import { Header } from "@/components/index";
import { useState, useEffect } from "react";
import { VictoryPie, VictoryTheme } from "victory";
import { supabase } from "@/lib/supabaseClient";

function wrapText(text: string, maxLineLength = 10) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length > maxLineLength) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = currentLine ? currentLine + " " + word : word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines.join("\n");
}

type SubjectData = { x: string; y: number };

function Statistic() {
  const [data, setData] = useState<SubjectData[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [lineData, setLineData] = useState<{ x: Date; y: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData.session?.access_token;
        if (!token) return;

        const res = await fetch("/api/stats/subjects", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch subjects");
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;

    const fetchLineData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) return;

      const res = await fetch(
        `/api/stats/subjects/${encodeURIComponent(selectedSubject)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        setLineData([]);
        return;
      }

      const json = await res.json();

      if (Array.isArray(json)) {
        const parsed = json.map((item: any) => ({
          x: new Date(item.x),
          y: item.y,
        }));
        setLineData(parsed);
      } else {
        console.warn("Expected array, got:", json);
        setLineData([]);
      }
    };

    fetchLineData();
  }, [selectedSubject]);
  return (
    <div>
      <Header />
      <h1 className="pl-[30px] pt-[20px] text-xl font-semibold">
        Кількість завдань по предметам
      </h1>
      <div className="min-h-screen flex flex-col items-center pt-6 space-y-10">
        {loading ? (
          <p>Завантаження...</p>
        ) : (
          <div style={{ width: "400px", height: "400px" }}>
            <VictoryPie
              data={data}
              labelRadius={20}
              theme={VictoryTheme.material}
              labels={({ datum }) => `${wrapText(datum.x)}\n${datum.y}`}
              style={{
                labels: { fontSize: 12, fill: "#333", whiteSpace: "pre-line" },
              }}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onClick: () => {
                      return [
                        {
                          target: "data",
                          mutation: (props) => {
                            setSelectedSubject(props.datum.x);
                            return null;
                          },
                        },
                      ];
                    },
                  },
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistic;
