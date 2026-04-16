using FluentValidation;

namespace HSPichanga.Application.Features.Canchas.Commands.CrearCancha;

public class CrearCanchaCommandValidator : AbstractValidator<CrearCanchaCommand>
{
    public CrearCanchaCommandValidator()
    {
        RuleFor(v => v.ZonaId).NotEmpty().WithMessage("La zona es requerida.");
        
        RuleFor(v => v.Nombre)
            .NotEmpty().WithMessage("El nombre de la cancha es requerido.")
            .MaximumLength(100).WithMessage("El nombre no puede exceder los 100 caracteres.");

        RuleFor(v => v.Descripcion)
            .NotEmpty().WithMessage("La descripción es requerida.");

        RuleFor(v => v.Direccion)
            .NotEmpty().WithMessage("La dirección es requerida.");

        RuleFor(v => v.CostoTotal)
            .GreaterThan(0).WithMessage("El costo total debe ser mayor a 0.");
            
        RuleFor(v => v.Modalidad)
            .IsInEnum().WithMessage("La modalidad no es válida.");
    }
}
