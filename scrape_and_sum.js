# scrape_and_sum.py
import asyncio
from playwright.async_api import async_playwright

async def scrape_and_sum():
    urls = [
        "https://sanand0.github.io/tdsdata/js_table/?seed=55",
        "https://sanand0.github.io/tdsdata/js_table/?seed=56",
        "https://sanand0.github.io/tdsdata/js_table/?seed=57",
        "https://sanand0.github.io/tdsdata/js_table/?seed=58",
        "https://sanand0.github.io/tdsdata/js_table/?seed=59",
        "https://sanand0.github.io/tdsdata/js_table/?seed=60",
        "https://sanand0.github.io/tdsdata/js_table/?seed=61",
        "https://sanand0.github.io/tdsdata/js_table/?seed=62",
        "https://sanand0.github.io/tdsdata/js_table/?seed=63",
        "https://sanand0.github.io/tdsdata/js_table/?seed=64"
    ]

    total_overall_sum = 0.0

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        for url in urls:
            try:
                print(f"Navigating to: {url}")
                await page.goto(url, wait_until="domcontentloaded")

                # Get all text content from <td> elements within <table>s
                td_texts = await page.evaluate('''() => {
                    const tds = Array.from(document.querySelectorAll('table td'));
                    return tds.map(td => td.innerText.trim());
                }''')

                page_sum = 0.0
                for text in td_texts:
                    # Attempt to convert text to a number
                    try:
                        # Remove commas before converting to float
                        number = float(text.replace(',', ''))
                        page_sum += number
                    except ValueError:
                        # Ignore text that cannot be converted to a number
                        pass

                print(f"Sum for {url}: {page_sum}")
                total_overall_sum += page_sum

            except Exception as e:
                print(f"Error scraping {url}: {e}")

        await browser.close()
        print(f"Final Total Sum of all numbers across all pages: {total_overall_sum}")

if __name__ == "__main__":
    asyncio.run(scrape_and_sum())
