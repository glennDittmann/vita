use tauri::{plugin::TauriPlugin, Wry};
use tauri_plugin_log::fern::colors::{Color, ColoredLevelConfig};

const LOG_COLORS: ColoredLevelConfig = ColoredLevelConfig {
    trace: Color::Cyan,
    debug: Color::Blue,
    info: Color::Green,
    warn: Color::Yellow,
    error: Color::Red,
};

pub fn build_logger() -> TauriPlugin<Wry> {
    tauri_plugin_log::Builder::new()
        .level(log::LevelFilter::Info)
        .target(tauri_plugin_log::Target::new(
            tauri_plugin_log::TargetKind::Webview,
        ))
        .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
        .with_colors(LOG_COLORS)
        .build()
}
