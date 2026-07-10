import sys
from PIL import Image

def remove_background(image_path):
    img = Image.open(image_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    threshold = 30 # A bit higher threshold for compression artifacts

    visited = set()
    queue = []

    # Initialize queue with edge pixels that are black
    for x in range(width):
        for y in [0, height - 1]:
            r, g, b, a = pixels[x, y]
            if r < threshold and g < threshold and b < threshold:
                queue.append((x, y))
                visited.add((x, y))
                
    for y in range(height):
        for x in [0, width - 1]:
            r, g, b, a = pixels[x, y]
            if r < threshold and g < threshold and b < threshold:
                if (x, y) not in visited:
                    queue.append((x, y))
                    visited.add((x, y))

    # BFS to flood fill
    # Using a list as a queue is slow for pop(0), let's use collections.deque
    from collections import deque
    q = deque(queue)

    while q:
        x, y = q.popleft()
        pixels[x, y] = (0, 0, 0, 0) # Make transparent

        # Check neighbors
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height:
                if (nx, ny) not in visited:
                    r, g, b, a = pixels[nx, ny]
                    if r < threshold and g < threshold and b < threshold:
                        visited.add((nx, ny))
                        q.append((nx, ny))

    img.save(image_path)
    print("Background removed successfully.")

if __name__ == "__main__":
    import os
    target_path = os.path.join(os.path.dirname(__file__), "assets", "emoji.png")
    remove_background(target_path)
