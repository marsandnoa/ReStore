using System.Text.Json;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext context;
        private readonly IMapper mapper;
        public ProductsController(StoreContext context, IMapper mapper)
        {
            this.context=context;
            this.mapper=mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var query=context.Products
            .Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands,productParams.Types)
            .AsQueryable();
            Console.WriteLine(query.ToQueryString());
            var products=await PagedList<Product>.ToPagedList(query,productParams.PageNumber,productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;
        }



        [HttpGet("{id}", Name="GetProduct")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product=await context.Products.FindAsync(id);

            if(product==null) return NotFound();

            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {
            var brands= await this.context.Products.Select(p=>p.Brand).Distinct().ToListAsync();
            var types= await this.context.Products.Select(p=>p.Type).Distinct().ToListAsync();

            return Ok(new {brands,types});
        }

        [Authorize(Roles="Admin")]
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto productDto)
        {
            var product=this.mapper.Map<Product>(productDto);

            this.context.Products.Add(product);

            var result=await this.context.SaveChangesAsync()>0;
            if(result) return CreatedAtRoute("GetProduct",new {id=product.Id},product);

            return BadRequest(new ProblemDetails {Title="Problem creating product"});
        }

        [Authorize(Roles="Admin")]
        [HttpPut]
        public async Task<ActionResult> UpdateProduct (UpdateProductDto productDto){
            var product=await this.context.Products.FindAsync(productDto.Id);

            if(product==null) return NotFound();

            this.mapper.Map(productDto,product);

            var result=await this.context.SaveChangesAsync()>0;

            if(result) return NoContent();

            return BadRequest(new ProblemDetails {Title="Problem updating product"});
        }

        [Authorize(Roles="Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id){
            var product=await this.context.Products.FindAsync(id);

            if(product==null) return NotFound();

            this.context.Products.Remove(product);

            var result=await this.context.SaveChangesAsync()>0;

            if(result) return Ok();

            return BadRequest(new ProblemDetails {Title="Problem deleting product"});
        
    }
    }
}