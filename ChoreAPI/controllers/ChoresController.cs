using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;

[ApiController]
[Route("api/[controller]")]
public class ChoresController: ControllerBase{

    static private List<Chore> Chores = new List<Chore>{
        new Chore{
            Id = 1,
            Name = "Tarefa 1",
            Description = "Descrição 1"
        }
    };

    [HttpPost]
    public ActionResult CreateChore(Chore newChore){
        if(newChore is null)
            return BadRequest();

        int id = Chores.Count == 0? 1: Chores.Max(c => c.Id) + 1;
        newChore.Id = id;
        Chores.Add(newChore);
        return Created();
    }

    [HttpGet]
    public ActionResult <List<Chore>> GetChores(){
        return Ok(Chores);
    }

    [HttpGet("{id}")]
    public ActionResult<Chore> GetChore(int id){
        Chore? chore = Chores.Find(c => c.Id == id);
        if(chore is null)
            return NotFound("Afazer não encontrado.");
        
        return Ok(chore);
    }

    [HttpGet]
    [Route("erro")]
    public ActionResult<Chore> Erro(){
        return BadRequest();
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteChore(int id){

        Chore? choreToDelete = Chores.Find(c => c.Id == id);
        if(choreToDelete is null)
            return NotFound();

        Chores.Remove(choreToDelete);
        return NoContent();
    }

    [HttpPut("{id}")]
    public ActionResult UpdateChore(int id, Chore updatedChore){

        if(id != updatedChore.Id)
            return BadRequest();
        
        int choreIndex = Chores.FindIndex(c => c.Id == id);
        if(choreIndex == -1)
            return NotFound();
        
        Chores[choreIndex] = updatedChore;
        return NoContent();
    }

}