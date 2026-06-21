const SUPABASE_URL = "https://eelsmcqdfixygtsfbwbs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVlbHNtY3FkZml4eWd0c2Zid2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMjEyMzEsImV4cCI6MjA5NzU5NzIzMX0.fMu_YNrbMVfJGOmNc6A_LfVXsP_ay6guamnt0Oy6v7I";

const countElement = document.querySelector("#count");
const statusMessage = document.querySelector("#statusMessage");
const realtimeStatus = document.querySelector("#realtimeStatus");

const decrementButton = document.querySelector("#decrementButton");
const resetButton = document.querySelector("#resetButton");
const incrementButton = document.querySelector("#incrementButton");

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let count = 0;

const buttons = [decrementButton, resetButton, incrementButton];

const updateCount = () => {
  countElement.textContent = count;
};

const updateStatus = (message, type = "info") => {
  statusMessage.textContent = message;
  statusMessage.dataset.type = type;
};

const setButtonsDisabled = (isDisabled) => {
  buttons.forEach((button) => {
    button.disabled = isDisabled;
  });
};

const updateRealtimeStatus = (message, type = "connecting") => {
  realtimeStatus.textContent = message;
  realtimeStatus.dataset.type = type;
};

const loadCount = async () => {
  setButtonsDisabled(true);
  updateStatus("Supabaseから数字を読み込み中です...");

  const { data, error } = await supabaseClient
    .from("counters")
    .select("count")
    .eq("id", 1)
    .single();

  if (error) {
    updateStatus("数字の読み込みに失敗しました。Supabase設定を確認してください。", "error");
    setButtonsDisabled(false);
    return;
  }

  count = Number(data.count);
  updateCount();
  updateStatus("Supabaseから最新の数字を読み込みました。", "success");
  setButtonsDisabled(false);
};

const saveCount = async () => {
  setButtonsDisabled(true);
  updateStatus("Supabaseに数字を保存中です...");

  const { error } = await supabaseClient
    .from("counters")
    .update({ count })
    .eq("id", 1);

  if (error) {
    updateStatus("数字の保存に失敗しました。ページを再読み込みして確認してください。", "error");
    setButtonsDisabled(false);
    return;
  }

  updateStatus("Supabaseに数字を保存しました。", "success");
  setButtonsDisabled(false);
};

const changeCount = async (nextCount) => {
  count = nextCount;
  updateCount();
  await saveCount();
};

const subscribeToCountChanges = () => {
  updateRealtimeStatus("● Realtime 接続中", "connecting");

  supabaseClient
    .channel("counters-id-1-count")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "counters",
        filter: "id=eq.1",
      },
      (payload) => {
        count = Number(payload.new.count);
        updateCount();
        updateRealtimeStatus("● Realtime 同期中", "connected");
        updateStatus("別の画面で更新された数字を反映しました。", "success");
      },
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        updateRealtimeStatus("● Realtime 接続済み", "connected");
        return;
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        updateRealtimeStatus("● Realtime エラー", "error");
        updateStatus("Realtime接続に失敗しました。SupabaseのRealtime設定を確認してください。", "error");
      }
    });
};

decrementButton.addEventListener("click", () => {
  changeCount(count - 1);
});

resetButton.addEventListener("click", () => {
  changeCount(0);
});

incrementButton.addEventListener("click", () => {
  changeCount(count + 1);
});

loadCount();
subscribeToCountChanges();
