using BookProject.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace BookProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDBContext _bookContext;
        public BookController(BookDBContext temp) => _bookContext = temp;

        [HttpGet("AllProjects")]
        public async Task<IActionResult> Get(int pageHowMany = 5, int pageNum = 1, bool sortByTitle = true, string sortDirection = "asc", [FromQuery] List<string>? bookTypes = null)
        {
            var query = _bookContext.Books.AsQueryable();
            
            if (bookTypes != null)
            {
                query = query.Where(b => bookTypes.Contains(b.Category));
            }

            if (sortByTitle)
            {
                if (sortDirection.ToLower() == "desc")
                {
                    query = query.OrderByDescending(b => b.Title);
                }
                else
                {
                    query = query.OrderBy(b => b.Title);
                }
            }
            
            var totalNumBooks = await query.CountAsync();
            
            var books = await query
                .Skip((pageNum - 1) * pageHowMany)
                .Take(pageHowMany)
                .ToListAsync();

            BookListData response = new BookListData
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            };
            
            return Ok(response);
        }
        
        [HttpGet("GetBookTypes")]
        public async Task<IActionResult> GetBookTypes()
        {
            var bookTypes = await _bookContext.Books
                .Select(p => p.Category)
                .Distinct()
                .ToListAsync();

            return Ok(bookTypes);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBook(int id)
        {
            var book = await _bookContext.Books.FirstOrDefaultAsync(b => b.BookID == id);
            
            if (book == null)
            {
                return NotFound(new { message = $"Book with ID {id} not found" });
            }
            
            return Ok(book);
        }
        
        [HttpPost]
        public async Task<IActionResult> AddBook([FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest(new { message = "Book data is required" });
            }
            
            _bookContext.Books.Add(book);
            await _bookContext.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetBook), new { id = book.BookID }, book);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
        {
            if (book == null || id != book.BookID)
            {
                return BadRequest(new { message = "Invalid book data or ID mismatch" });
            }
            
            var existingBook = await _bookContext.Books.FirstOrDefaultAsync(b => b.BookID == id);
            
            if (existingBook == null)
            {
                return NotFound(new { message = $"Book with ID {id} not found" });
            }
            
            existingBook.Title = book.Title;
            existingBook.Author = book.Author;
            existingBook.Publisher = book.Publisher;
            existingBook.ISBN = book.ISBN;
            existingBook.Classification = book.Classification;
            existingBook.Category = book.Category;
            existingBook.PageCount = book.PageCount;
            existingBook.Price = book.Price;
            
            await _bookContext.SaveChangesAsync();
            
            return Ok(existingBook);
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _bookContext.Books.FindAsync(id);
            
            if (book == null)
            {
                return NotFound(new { message = $"Book with ID {id} not found" });
            }
            
            _bookContext.Books.Remove(book);
            await _bookContext.SaveChangesAsync();
            
            return Ok(new { message = $"Book with ID {id} deleted successfully" });
        }
    }
}
