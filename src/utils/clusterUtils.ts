import type { ClusterRectangle } from "../../src-tauri/bindings/ClusterRectangle";
import type { ClusterBounds2 } from "../../src-tauri/bindings/ClusterBounds2";

/**
 * Utility functions for working with cluster rectangles and visualization
 */

/**
 * Generate a deterministic color for a cluster based on its ID
 * This is a frontend fallback in case the backend doesn't provide colors
 * @param clusterId - The unique identifier for the cluster
 * @returns A hex color string (e.g., "#ff5733")
 */
export function generateClusterColor(clusterId: string): string {
    // Simple hash function for deterministic color generation
    let hash = 0;
    for (let i = 0; i < clusterId.length; i++) {
        const char = clusterId.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Generate RGB values from hash
    const r = Math.abs(hash) % 256;
    const g = Math.abs(hash >> 8) % 256;
    const b = Math.abs(hash >> 16) % 256;

    // Ensure colors are bright enough for visibility
    const brightR = r < 100 ? r + 100 : r;
    const brightG = g < 100 ? g + 100 : g;
    const brightB = b < 100 ? b + 100 : b;

    return `#${brightR.toString(16).padStart(2, '0')}${brightG.toString(16).padStart(2, '0')}${brightB.toString(16).padStart(2, '0')}`;
}

/**
 * Calculate the center point of a cluster rectangle
 * @param bounds - The cluster bounds
 * @returns The center point as [x, z] coordinates
 */
export function getClusterCenter(bounds: ClusterBounds2): [number, number] {
    const centerX = (bounds.min_x + bounds.max_x) / 2;
    const centerZ = (bounds.min_z + bounds.max_z) / 2;
    return [centerX, centerZ];
}

/**
 * Calculate the dimensions of a cluster rectangle
 * @param bounds - The cluster bounds
 * @returns The width and height as [width, height]
 */
export function getClusterDimensions(bounds: ClusterBounds2): [number, number] {
    const width = bounds.max_x - bounds.min_x;
    const height = bounds.max_z - bounds.min_z;
    return [width, height];
}

/**
 * Get the area of a cluster rectangle
 * @param bounds - The cluster bounds
 * @returns The area of the cluster rectangle
 */
export function getClusterArea(bounds: ClusterBounds2): number {
    const [width, height] = getClusterDimensions(bounds);
    return width * height;
}

/**
 * Sort cluster rectangles by various criteria
 */
export const clusterSorters = {
    /**
     * Sort clusters by vertex count (descending)
     */
    byVertexCount: (a: ClusterRectangle, b: ClusterRectangle) => b.vertex_count - a.vertex_count,

    /**
     * Sort clusters by area (descending)
     */
    byArea: (a: ClusterRectangle, b: ClusterRectangle) => getClusterArea(b.bounds) - getClusterArea(a.bounds),

    /**
     * Sort clusters by ID (alphabetical)
     */
    byId: (a: ClusterRectangle, b: ClusterRectangle) => a.id.localeCompare(b.id),
};

/**
 * Filter cluster rectangles by various criteria
 */
export const clusterFilters = {
    /**
     * Filter clusters by minimum vertex count
     */
    byMinVertexCount: (minCount: number) => (cluster: ClusterRectangle) => cluster.vertex_count >= minCount,

    /**
     * Filter clusters by minimum area
     */
    byMinArea: (minArea: number) => (cluster: ClusterRectangle) => getClusterArea(cluster.bounds) >= minArea,

    /**
     * Filter clusters that contain a specific point
     */
    containingPoint: (x: number, z: number) => (cluster: ClusterRectangle) => {
        const { bounds } = cluster;
        return x >= bounds.min_x && x <= bounds.max_x && z >= bounds.min_z && z <= bounds.max_z;
    },
};

/**
 * Convert a hex color to RGB values
 * @param hex - Hex color string (e.g., "#ff5733")
 * @returns RGB values as [r, g, b] where each value is 0-255
 */
export function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new Error(`Invalid hex color: ${hex}`);
    }
    return [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
    ];
}

/**
 * Convert RGB values to a hex color string
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string (e.g., "#ff5733")
 */
export function rgbToHex(r: number, g: number, b: number): string {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Adjust the brightness of a hex color
 * @param hex - Hex color string
 * @param factor - Brightness factor (0.5 = darker, 1.5 = brighter)
 * @returns Adjusted hex color string
 */
export function adjustColorBrightness(hex: string, factor: number): string {
    const [r, g, b] = hexToRgb(hex);
    const adjustedR = Math.min(255, Math.max(0, Math.round(r * factor)));
    const adjustedG = Math.min(255, Math.max(0, Math.round(g * factor)));
    const adjustedB = Math.min(255, Math.max(0, Math.round(b * factor)));
    return rgbToHex(adjustedR, adjustedG, adjustedB);
}

/**
 * Create a color palette for multiple clusters
 * @param count - Number of colors needed
 * @returns Array of hex color strings
 */
export function generateColorPalette(count: number): string[] {
    const colors: string[] = [];
    const hueStep = 360 / count;

    for (let i = 0; i < count; i++) {
        const hue = (i * hueStep) % 360;
        const saturation = 70 + (i % 3) * 10; // Vary saturation slightly
        const lightness = 50 + (i % 2) * 20;  // Vary lightness slightly

        colors.push(hslToHex(hue, saturation, lightness));
    }

    return colors;
}

/**
 * Convert HSL to hex color
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string
 */
function hslToHex(h: number, s: number, l: number): string {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs((hNorm * 6) % 2 - 1));
    const m = lNorm - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= hNorm && hNorm < 1 / 6) {
        r = c; g = x; b = 0;
    } else if (1 / 6 <= hNorm && hNorm < 2 / 6) {
        r = x; g = c; b = 0;
    } else if (2 / 6 <= hNorm && hNorm < 3 / 6) {
        r = 0; g = c; b = x;
    } else if (3 / 6 <= hNorm && hNorm < 4 / 6) {
        r = 0; g = x; b = c;
    } else if (4 / 6 <= hNorm && hNorm < 5 / 6) {
        r = x; g = 0; b = c;
    } else if (5 / 6 <= hNorm && hNorm < 1) {
        r = c; g = 0; b = x;
    }

    const rFinal = Math.round((r + m) * 255);
    const gFinal = Math.round((g + m) * 255);
    const bFinal = Math.round((b + m) * 255);

    return rgbToHex(rFinal, gFinal, bFinal);
}