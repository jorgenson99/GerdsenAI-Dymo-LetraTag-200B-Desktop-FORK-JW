// The editor sidebar: Content, Typeface, Style, Extras, Tape colour, Templates.
// A faithful port of the prototype's sidebar with the same controls and styling.

import { accent, FONTS, FONT_ORDER, ICONS, TAPE_ORDER, TAPES, TEMPLATES } from "../data";
import { Icon } from "../icons";
import { parseBatch, useStore } from "../store";
import { useState } from "react";
import { css, SEC_LABEL, seg } from "../ui";

export function Sidebar() {
  const s = useStore();
  const { state } = s;
  const ac = accent();
  const isText = state.mode === "text";

  return (
    <div style={css("width:300px;flex:none;border-right:1px solid rgba(255,255,255,.06);background:#0b0b0e;display:flex;flex-direction:column;")}>
      <div style={css("flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:20px;")}>
        {/* ---------- Content ---------- */}
        <div>
          <div style={css(SEC_LABEL)}>Content</div>
          <div style={css("display:flex;gap:6px;padding:3px;background:rgba(255,255,255,.04);border-radius:9px;border:1px solid rgba(255,255,255,.07);margin-bottom:10px;")}>
            <button onClick={() => s.setMode("text")} style={css(seg(isText) + ";flex:1;text-align:center;padding:9px;")}>Text</button>
            <button onClick={() => s.setMode("barcode")} style={css(seg(!isText) + ";flex:1;text-align:center;padding:9px;")}>Barcode</button>
          </div>

          {isText ? (
            <div style={css("display:flex;flex-direction:column;gap:8px;")}>
              <input
                value={state.line1}
                onChange={(e) => s.setLine1(e.target.value)}
                placeholder="Line 1"
                style={css("width:100%;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#161619;color:#f2f2f4;font-size:13px;font-weight:600;")}
              />
              <input
                value={state.line2}
                onChange={(e) => s.setLine2(e.target.value)}
                placeholder="Line 2"
                style={css((state.twoLines ? "" : "opacity:.4;pointer-events:none;") + "width:100%;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#161619;color:#f2f2f4;font-size:13px;font-weight:600;")}
              />
              <div style={css("display:flex;gap:7px;")}>
                <button onClick={s.toggleTwo} style={css(seg(state.twoLines) + ";flex:1;")}>2 lines</button>
                <div style={css("display:flex;gap:4px;padding:3px;background:rgba(255,255,255,.04);border-radius:9px;border:1px solid rgba(255,255,255,.07);")}>
                  <button onClick={() => s.setAlign("left")} style={css(seg(state.align === "left"))}>‹</button>
                  <button onClick={() => s.setAlign("center")} style={css(seg(state.align === "center"))}>≡</button>
                  <button onClick={() => s.setAlign("right")} style={css(seg(state.align === "right"))}>›</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={css("display:flex;flex-direction:column;gap:8px;")}>
              <input
                value={state.barcode}
                onChange={(e) => s.setBarcode(e.target.value)}
                placeholder="Barcode data"
                style={css("width:100%;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#161619;color:#f2f2f4;font-size:12px;font-weight:600;font-family:ui-monospace,Menlo,monospace;")}
              />
              <input
                value={state.barcodeText ?? ""}
                onChange={(e) => s.setBarcodeText(e.target.value)}
                placeholder="Big text beside it (e.g. 3B)"
                style={css("width:100%;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#161619;color:#f2f2f4;font-size:13px;font-weight:700;")}
              />
              <div style={css("display:flex;gap:7px;align-items:center;")}>
                <span style={css("font-size:11px;color:#8a8a94;width:34px;")}>Bars</span>
                <div style={css("display:flex;gap:4px;padding:3px;background:rgba(255,255,255,.04);border-radius:9px;border:1px solid rgba(255,255,255,.07);flex:1;")}>
                  {[1, 2, 3].map((b) => (
                    <button key={b} onClick={() => s.setBarcodeBar(b)} style={css(seg((state.barcodeBar || 2) === b) + ";flex:1;text-align:center;")}>
                      {b === 1 ? "Thin" : b === 2 ? "Wide" : "XL"}
                    </button>
                  ))}
                </div>
              </div>
              <div style={css("display:flex;gap:7px;align-items:center;")}>
                <span style={css("font-size:11px;color:#8a8a94;width:34px;")}>Under</span>
                <button onClick={s.toggleBarcodeCaption} style={css(seg(!!state.barcodeCaption) + ";flex:1;text-align:center;")}>
                  {state.barcodeCaption ? "Small text under bars: on" : "Small text under bars: off"}
                </button>
              </div>
            </div>
          )}
        </div>

        {!isText && <BatchPanel />}

        {isText && (
          <>
            {/* ---------- Typeface ---------- */}
            <div>
              <div style={css(SEC_LABEL)}>Typeface</div>
              <div style={css("display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;")}>
                {FONT_ORDER.map((id) => {
                  const ff = FONTS[id];
                  const on = state.fontFamily === id;
                  const extra =
                    ";font-family:" + ff.stack + ";" + (id === "display" ? "letter-spacing:.02em;" : "") + (id === "script" ? "font-size:14px;" : "font-size:12px;");
                  return (
                    <button key={id} onClick={() => s.setFontFamily(id)} style={css(seg(on) + extra)}>
                      {ff.label}
                    </button>
                  );
                })}
              </div>

              {/* ---------- Style ---------- */}
              <div style={css(SEC_LABEL)}>Style</div>
              <div style={css("display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;")}>
                <div style={css("display:flex;gap:4px;padding:3px;background:rgba(255,255,255,.04);border-radius:9px;border:1px solid rgba(255,255,255,.07);")}>
                  <button onClick={() => s.setFontSize("S")} style={css(seg(state.font === "S"))}>S</button>
                  <button onClick={() => s.setFontSize("M")} style={css(seg(state.font === "M"))}>M</button>
                  <button onClick={() => s.setFontSize("L")} style={css(seg(state.font === "L"))}>L</button>
                </div>
                <button onClick={s.toggleBold} style={css(seg(state.bold))}>B</button>
                <button onClick={s.toggleUnderline} style={css(seg(state.underline))}>U</button>
                <button onClick={s.toggleInvert} style={css(seg(state.invert))}>Inv</button>
              </div>
              <div style={css("display:flex;align-items:center;gap:10px;")}>
                <span style={css("font-size:11px;color:#8a8a92;font-weight:600;white-space:nowrap;")}>Padding</span>
                <input
                  type="range"
                  min={0}
                  max={6}
                  step={1}
                  value={state.padding}
                  onChange={(e) => s.setPadding(+e.target.value)}
                  style={{ flex: 1, accentColor: ac.hex }}
                />
                <span style={css("font-size:11px;color:#cfcfd6;font-weight:700;width:14px;")}>{state.padding}</span>
              </div>
            </div>

            {/* ---------- Extras ---------- */}
            <div>
              <div style={css(SEC_LABEL)}>Extras</div>
              <div style={css("display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;")}>
                {ICONS.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => s.setIcon(g)}
                    style={css(seg(state.icon === g) + ";width:34px;height:32px;display:flex;align-items:center;justify-content:center;font-size:13px;padding:0;")}
                  >
                    {g === "" ? "∅" : g}
                  </button>
                ))}
              </div>
              <button onClick={s.toggleDate} style={css(seg(state.date) + ";width:100%;")}>Insert today's date</button>
            </div>
          </>
        )}

        {/* ---------- Tape colour ---------- */}
        <div>
          <div style={css(SEC_LABEL)}>Tape colour</div>
          <div style={css("display:flex;gap:9px;flex-wrap:wrap;")}>
            {TAPE_ORDER.map((id) => {
              const tp = TAPES[id];
              const on = state.tape === id;
              const ring = on ? "0 0 0 2px " + ac.hex + ",0 0 0 4px rgba(0,0,0,.5)" : "0 0 0 1px rgba(255,255,255,.18)";
              return (
                <button
                  key={id}
                  title={tp.label}
                  onClick={() => s.setTape(id)}
                  style={css("width:32px;height:32px;border-radius:9px;border:none;cursor:pointer;background:" + tp.sw + ";box-shadow:" + ring + ";padding:0;transition:box-shadow .14s;")}
                />
              );
            })}
          </div>
          <div style={css("font-size:11px;color:#62626a;font-weight:600;margin-top:8px;")}>{TAPES[state.tape].label} · black thermal print</div>
        </div>

        {/* ---------- Templates ---------- */}
        <div>
          <div style={css(SEC_LABEL)}>Templates</div>
          <div style={css("display:flex;flex-direction:column;gap:6px;")}>
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => s.applySnapshot(t.s)}
                style={css("display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:8px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.02);color:#cfcfd6;font-size:12px;font-weight:600;cursor:pointer;text-align:left;")}
              >
                <span style={css("width:18px;display:flex;align-items:center;justify-content:center;color:#9a9aa2;")}>
                  <Icon name={t.lucide} size={16} color="#9a9aa2" />
                </span>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Batch: paste a list (one label per line: TEXT, BARCODE), print them all in one go,
// and keep named sets on this PC.
function BatchPanel() {
  const s = useStore();
  const { state } = s;
  const ac = accent();
  const [name, setName] = useState("");
  const items = parseBatch(state.batchText || "");
  const box = "width:100%;padding:9px 11px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:#161619;color:#f2f2f4;";
  return (
    <div>
      <div style={css(SEC_LABEL)}>Batch</div>
      <div style={css("font-size:11px;color:#8a8a94;margin-bottom:6px;line-height:1.4;")}>One label per line: <b style={css("color:#cfcfd6;")}>TEXT, BARCODE</b> (tab, comma or ;). Uses the bar settings above.</div>
      <textarea
        value={state.batchText || ""}
        onChange={(e) => s.setBatchText(e.target.value)}
        placeholder={"3A, LOC-61\n3B, LOC-60\n3C, LOC-59"}
        rows={6}
        style={css(box + "font-size:12px;font-family:ui-monospace,Menlo,monospace;resize:vertical;min-height:90px;")}
      />
      <button
        onClick={() => void s.runBatch()}
        disabled={!items.length}
        style={css("width:100%;margin-top:8px;padding:11px;border-radius:10px;border:none;font-size:13px;font-weight:700;cursor:pointer;" + (items.length ? "background:" + ac.grad + ";color:#0a0a0a;" : "background:rgba(255,255,255,.06);color:#6a6a72;cursor:default;"))}
      >
        {items.length ? "Print all " + items.length + " labels" : "Paste labels to print"}
      </button>
      <div style={css("display:flex;gap:6px;margin-top:10px;")}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Set name, e.g. Cabinet 3" style={css(box + "font-size:12px;flex:1;min-width:0;")} />
        <button
          onClick={() => { s.saveSet(name); setName(""); }}
          style={css(seg(false) + ";white-space:nowrap;")}
        >
          Save set
        </button>
      </div>
      {state.sets?.length ? (
        <div style={css("display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;")}>
          {state.sets.map((st) => (
            <span key={st.name} style={css("display:inline-flex;align-items:center;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);overflow:hidden;")}>
              <button onClick={() => s.setBatchText(st.text)} style={css("padding:6px 9px;background:none;border:none;color:#e6e6ea;font-size:12px;font-weight:600;cursor:pointer;")}>
                {st.name} <span style={css("color:#8a8a94;")}>· {parseBatch(st.text).length}</span>
              </button>
              <button onClick={() => s.deleteSet(st.name)} aria-label={"Delete set " + st.name} style={css("padding:6px 8px;background:none;border:none;border-left:1px solid rgba(255,255,255,.08);color:#8a8a94;cursor:pointer;")}>×</button>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
